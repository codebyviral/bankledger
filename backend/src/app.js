const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

/**
 * Routers
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");
const ledgerRouter = require("./routes/ledger.routes");

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/ledger", ledgerRouter);

module.exports = app;
