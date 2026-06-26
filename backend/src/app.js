const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

let allowedOrigins = [process.env.CORS_ORIGIN];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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
