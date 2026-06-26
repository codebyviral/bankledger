const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");

async function getLedger(req, res) {
  const userId = req.user._id;

  const account = await accountModel.findOne({
    user: userId,
    status: "ACTIVE",
  });

  if (!account) {
    return res
      .status(404)
      .json({ message: "Account not found", status: "failed" });
  }

  const accountId = account._id;

  const ledger = await ledgerModel
    .find({
      account: accountId,
    })
    .sort({ createdAt: -1 });
  return res.status(200).json({
    message: "Ledger retrieved successfully",
    status: "success",
    data: ledger,
  });
}

async function getMonthlySpending(req,res) {
  const userId = req.user._id;

  const accountExists = await accountModel.findOne({ user: userId });

  console.log(accountExists)

  if (!accountExists) {
    return res.status(400).json({
      status: "failed",
      message: "Account is inactive or not found",
    });
  }

  // Setup month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1, 1);
  endOfMonth.setHours(0, 0, 0, 0);

  const monthlySpending = await ledgerModel.aggregate([
    // stage 1
    {
      $match: {
        account: accountExists._id,
        type: "DEBIT",
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      },
    },
    // stage 2
    {
      $group: {
        _id: null,
        totalSpent: {
          $sum: "$amount",
        },
      },
    },
  ]);

  // If no transactions this month, aggregate returns []
  const totalSpent =
    monthlySpending.length > 0 ? monthlySpending[0].totalSpent : 0;

  return res.status(200).json({
    status: "success",
    totalSpent,
  });
}

module.exports = {
  getLedger,
  getMonthlySpending,
};
