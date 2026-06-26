const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with an account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status must be one of PENDING, COMPLETED, FAILED, REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0, "Transaction amount must be positive"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      index: true,
      unique: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
