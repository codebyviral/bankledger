const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require("../models/blacklist.model");
const accountModel = require("../models/account.model");
const { v7: uuidv7 } = require("uuid");
const ledgerModel = require("../models/ledger.model");
const { default: mongoose } = require("mongoose");
const transactionModel = require("../models/transaction.model");
/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      message: "All fields are required",
      status: "failed",
    });
  }

  const isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res.status(422).json({
      message: "User already exists with email.",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const account = await accountModel.create({
    user: user._id,
  });

  const toAccountId = account._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  const idempotencyKey = uuidv7();

  const transaction = new transactionModel({
    fromAccount: `6a36587af6b9f6791af2af6b`, // System account ID
    toAccount: toAccountId,
    amount: 100000,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: `6a36587af6b9f6791af2af6b`, // System account ID,
        transaction: transaction._id,
        amount: 100000,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccountId,
        transaction: transaction._id,
        amount: 100000,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });
  await session.commitTransaction();
  session.endSession();

  await emailService.sendCreditEmail(
    user.email,
    user.name,
    100000,
    toAccountId,
  );

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });

  await emailService.sendRegisterEmail(user.email, user.name);
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or password is invalid",
    });
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return res.status(401).json({
      message: "Email or password is invalid",
    });
  }

  const accountId = await accountModel.findOne({
    user: user._id,
    status: "ACTIVE",
  });

  const token = jwt.sign(
    {
      userId: user._id,
      accountId: accountId._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      accountId: accountId._id,
    },
    token,
  });
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function logoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      message: "User logged out successfully",
    });
  }

  res.cookie("token", "", { maxAge: 0 });

  await tokenBlacklistModel.create({ token });

  res.status(200).json({
    message: "User logged out successfully",
    status: "success",
  });
}

module.exports = { userRegisterController, loginController, logoutController };
