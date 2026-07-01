const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const { buildDebitEmail, buildCreditEmail } = require("../emails/email.templates");
const emailService = require("../helpers/emailService");
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction as COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 *
 */

async function createTransaction(req, res) {
  const { toEmail, amount, idempotencyKey, note } = req.body;

  const userId = req.user._id;

  const userBankAccount = await accountModel.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!userBankAccount)
    return res.status(403).json({
      message: "Account not ACTIVE or Account not Found",
      status: "failed",
    });

  let fromAccount = userBankAccount._id;

  /**
   * 1. Validate request
   */
  if (!fromAccount || !toEmail || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "From account, to account, amount, and idempotency key are required",
      status: "failed",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  let toAccount = "";

  const toUser = await userModel.findOne({
    email: toEmail,
  });

  if (!toUser)
    return res
      .status(404)
      .json({ message: "Invalid recipient account", status: "failed" });

  const toUserId = toUser._id;

  const receiverAccount = await accountModel.findOne({
    user: toUserId,
  });

  toAccount = receiverAccount._id;

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "From account or to account not found",
      status: "failed",
    });
  }

  if (toAccount.toString() === fromAccount.toString()) {
    return res.status(400).json({
      message: "Cannot transfer fund to your own account",
      status: "failed",
    });
  }

  /**
   * 2. Validate idempotency key
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists,
        status: "success",
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
        status: "Pending",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction failed",
        status: "failed",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction has been reversed",
        status: "failed",
      });
    }
  }

  /**
   * 3. Check account status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "From account or to account is not active",
      status: "failed",
    });
  }

  /**
   * 4. Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Request amount is ${amount}`,
      status: "failed",
    });
  }
  let transaction;
  try {
    /**
     * 5. Create transaction
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            note,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromUserAccount,
          transaction: transaction._id,
          amount,
          type: "DEBIT",
        },
      ],
      { session },
    );

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          amount,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    return res.status(400).json({
      message:
        "Transaction is pending due to some issue, please try again later",
    });
  }

  /**
   * 10. Send email notification
   */

  res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
    status: "success",
  });

  try {
    const { subject, html } = buildDebitEmail({
      name: req.user.name,
      amount,
      fromAccount,
      toAccount,
    });

    await emailService.sendEmail(req.user.email, subject, html);

    const { subject: subject2, html: html2 } = buildCreditEmail({
      name: req.user.name,
      amount,
      fromAccount,
      toAccount,
    });

    await emailService.sendEmail(toUser.email, subject2, html2);
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "To account, amount, and idempotency key are required",
      status: "failed",
    });
  }

  const toUserAccount = await accountModel.findOne({
    user: toAccount,
  });

  if (!toUserAccount) {
    return res.status(404).json({
      message: "Invalid account",
      status: "failed",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System account not found for user",
      status: "failed",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        transaction: transaction._id,
        amount,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        transaction: transaction._id,
        amount,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction,
    status: "success",
  });
}

async function getRecentTransactions(req, res) {
  const accountId = req.account._id;

  const recentTransactions = await transactionModel
    .find({
      $or: [{ fromAccount: accountId }, { toAccount: accountId }],
    })
    .sort({ createdAt: -1 })
    .limit(3);

  return res.status(200).json({
    recentTransactions,
    status: "success",
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
  getRecentTransactions,
};
