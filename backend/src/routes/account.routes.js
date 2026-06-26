const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const createAccountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected route
 */

router.post("/create", authMiddleware.authMiddleware, createAccountController.createAccountController,);

/**
 * - GET /api/accounts/
 * - Get all accounts for the authenticated user
 * - Protected route
 */

router.get("/",authMiddleware.authMiddleware, createAccountController.getAccountsController);


/**
 * - GET /api/accounts/balance/:accountId
 * - Get the balance of a specific account
 * - Protected route
 */

router.get("/balance/", authMiddleware.authMiddleware, createAccountController.getAccountBalanceController);

module.exports = router;
