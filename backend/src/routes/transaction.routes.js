const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const authSystemUserMiddleware = require("../middleware/auth.middleware");

const transactionRouter = express.Router();

/**
 * - POST /api/transactions
 * - Create a new transaction
 */

transactionRouter.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

/**
 * - POST /api/transactions/initial-funds
 * - Create an initial funds transaction
 */

transactionRouter.post(
  "/initial-funds",
  authSystemUserMiddleware.authSystemUserMiddleware,
  transactionController.createInitialFundsTransaction,
);

/**
 * - GET /api/transactions/recent
 * - Get recent transactions
 */

transactionRouter.get(
  "/recent",
  authMiddleware.authMiddleware,
  transactionController.getRecentTransactions,
);

module.exports = transactionRouter;
