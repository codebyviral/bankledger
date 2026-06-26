const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;

  const existingAccount = await accountModel.findOne({
    user: user._id,
  });

  if (existingAccount) {
    return res.status(400).json({
      message: "Account already exists for this user",
      status: "failed",
    });
  }

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

async function getAccountsController(req, res) {
  const accounts = await accountModel.find({
    user: req.user._id,
  });

  res.status(200).json({
    accounts,
  });
}

async function getAccountBalanceController(req, res) {

  const userId = req.user._id;

  const userBankAccount = await accountModel.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!userBankAccount) {
    return res
      .status(403)
      .json({
        message: "Account not ACTIVE or Account not Found",
        status: "failed",
      });
  }

  let accountId = userBankAccount._id;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
      status: "failed",
    });
  }

  const balance = await account.getBalance();

  return res.status(200).json({
    accountId: account._id,
    balance,
  });
}

module.exports = {
  createAccountController,
  getAccountsController,
  getAccountBalanceController,
};
