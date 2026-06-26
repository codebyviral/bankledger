const { getLedger, getMonthlySpending } = require("../controllers/ledger.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const express = require("express");

const ledgerRouter = express.Router();

ledgerRouter.get("/", authMiddleware, getLedger);
ledgerRouter.get("/monthly-transactions",authMiddleware,getMonthlySpending)

module.exports = ledgerRouter;
