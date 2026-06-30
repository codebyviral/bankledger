require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },

  // Timeouts
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// ─── Shared Layout Wrapper ────────────────────────────────────────────────────
const emailWrapper = (content, accentColor = "#b45309") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Banking Ledger</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f5f3ee;
  font-family: 'Courier New', Courier, monospace;
  color: #3d3929;
  -webkit-font-smoothing: antialiased;
">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ee; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" width="100%" style="max-width: 560px;" cellpadding="0" cellspacing="0">

          <!-- Header / Logo bar -->
          <tr>
            <td style="
              background-color: #ffffff;
              border: 1px solid #e2ddd4;
              border-bottom: none;
              padding: 24px 32px 20px;
            ">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="
                      display: inline-block;
                      font-size: 11px;
                      font-weight: 700;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: #ffffff;
                      background-color: ${accentColor};
                      padding: 4px 10px;
                      line-height: 1;
                    ">BL</span>
                    <span style="
                      font-size: 14px;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      color: #3d3929;
                      margin-left: 10px;
                      vertical-align: middle;
                    ">Banking Ledger</span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="
                      font-size: 10px;
                      letter-spacing: 0.06em;
                      text-transform: uppercase;
                      color: #9c9480;
                    ">Secure &bull; Reliable</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr>
            <td style="height: 3px; background-color: ${accentColor};"></td>
          </tr>

          <!-- Main content card -->
          <tr>
            <td style="
              background-color: #ffffff;
              border: 1px solid #e2ddd4;
              border-top: none;
              padding: 36px 32px 32px;
            ">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    border-top: 1px solid #e2ddd4;
                    padding-top: 16px;
                    font-size: 10px;
                    color: #9c9480;
                    letter-spacing: 0.04em;
                    line-height: 1.7;
                  ">
                    <p style="margin: 0 0 4px;">This is an automated message from <strong>Banking Ledger</strong>. Please do not reply to this email.</p>
                    <p style="margin: 0;">If you have questions, contact support. &copy; ${new Date().getFullYear()} Banking Ledger. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Reusable UI Primitives ───────────────────────────────────────────────────

const greeting = (name) => `
  <p style="
    margin: 0 0 24px;
    font-size: 13px;
    color: #6b6348;
    letter-spacing: 0.02em;
  ">Hello, <strong style="color: #3d3929;">${name}</strong></p>
`;

const divider = () => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
    <tr><td style="height: 1px; background-color: #ede9e0;"></td></tr>
  </table>
`;

const infoRow = (label, value, highlight = false) => `
  <tr>
    <td style="
      padding: 10px 14px;
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #9c9480;
      white-space: nowrap;
      border-bottom: 1px solid #f0ece4;
    ">${label}</td>
    <td style="
      padding: 10px 14px;
      font-size: 13px;
      font-weight: ${highlight ? "700" : "400"};
      color: ${highlight ? "#b45309" : "#3d3929"};
      border-bottom: 1px solid #f0ece4;
      word-break: break-all;
    ">${value}</td>
  </tr>
`;

const infoTable = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
    border: 1px solid #e2ddd4;
    border-collapse: collapse;
    margin: 20px 0;
  ">
    <tbody>${rows}</tbody>
  </table>
`;

const statusBadge = (text, color, bg) => `
  <span style="
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${color};
    background-color: ${bg};
    padding: 4px 10px;
    border: 1px solid ${color}33;
    line-height: 1.4;
  ">${text}</span>
`;

const headingBlock = (label, title, accentColor = "#b45309") => `
  <div style="margin-bottom: 28px;">
    <div style="
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${accentColor};
      font-weight: 700;
      margin-bottom: 8px;
    ">${label}</div>
    <div style="
      font-size: 22px;
      font-weight: 700;
      color: #3d3929;
      letter-spacing: -0.01em;
      line-height: 1.2;
    ">${title}</div>
  </div>
`;

const bodyText = (text) => `
  <p style="
    margin: 0 0 16px;
    font-size: 13px;
    line-height: 1.75;
    color: #5a5340;
    letter-spacing: 0.01em;
  ">${text}</p>
`;

const signOff = () => `
  <p style="
    margin: 28px 0 0;
    font-size: 12px;
    color: #9c9480;
    letter-spacing: 0.04em;
    line-height: 1.6;
  ">
    Best regards,<br />
    <strong style="color: #3d3929;">The Banking Ledger Team</strong>
  </p>
`;

// ─── Function to send email ───────────────────────────────────────────────────
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// ─── Email Templates ──────────────────────────────────────────────────────────

async function sendRegisterEmail(userEmail, name) {
  const subject = "Welcome to Banking Ledger!";

  const text = `Hello ${name},\n\nThank you for registering with Banking Ledger! We're excited to have you on board.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("New Account", "Welcome aboard.")}
    ${greeting(name)}
    ${bodyText("Your account has been successfully created. You now have access to Banking Ledger — a secure platform to manage your finances, track transactions, and stay in control.")}
    ${divider()}
    ${infoTable(
      infoRow(
        "Status",
        statusBadge("Account Active", "#15803d", "#f0fdf4"),
        false,
      ) +
        infoRow("Registered Email", userEmail, false) +
        infoRow(
          "Member Since",
          new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          false,
        ),
    )}
    ${bodyText("If you did not create this account, please contact our support team immediately.")}
    ${signOff()}
  `;

  const html = emailWrapper(content, "#b45309");
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount,
) {
  const subject = "Transaction Alert!";
  const fromLast6 = String(fromAccount).slice(-6);
  const toLast6 = String(toAccount).slice(-6);

  const text = `Hello ${name},\n\nA transaction of ₹${amount} has been made from account ••••${fromLast6} to account ••••${toLast6}.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Transaction Alert", `₹${amount} Transferred`, "#b45309")}
    ${greeting(name)}
    ${bodyText("A fund transfer has been successfully processed on your account. Please review the details below.")}
    ${infoTable(
      infoRow("Amount", `₹${Number(amount).toLocaleString("en-IN")}`, true) +
        infoRow("From Account", `••••${fromLast6}`) +
        infoRow("To Account", `••••${toLast6}`) +
        infoRow(
          "Date & Time",
          new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        ) +
        infoRow("Status", statusBadge("Success", "#15803d", "#f0fdf4")),
    )}
    ${bodyText("If you did not initiate this transaction, please contact support immediately and secure your account.")}
    ${signOff()}
  `;

  const html = emailWrapper(content, "#b45309");
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount,
) {
  const subject = "Transaction Failed Alert from Banking Ledger";
  const fromLast6 = String(fromAccount).slice(-6);
  const toLast6 = String(toAccount).slice(-6);

  const text = `Hello ${name},\n\nWe regret to inform you that a transaction of ₹${amount} from account ••••${fromLast6} to account ••••${toLast6} has failed.\n\nPlease check your account and try again.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Transaction Failed", `₹${amount} — Could Not Process`, "#b91c1c")}
    ${greeting(name)}
    ${bodyText("We were unable to complete the following transaction. Please review the details and try again.")}
    ${infoTable(
      infoRow("Amount", `₹${Number(amount).toLocaleString("en-IN")}`, true) +
        infoRow("From Account", `••••${fromLast6}`) +
        infoRow("To Account", `••••${toLast6}`) +
        infoRow(
          "Date & Time",
          new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        ) +
        infoRow("Status", statusBadge("Failed", "#b91c1c", "#fff1f2")),
    )}
    ${bodyText("Common reasons for failure include insufficient balance, network issues, or account restrictions. Please verify your account details and retry. If the problem persists, reach out to our support team.")}
    ${signOff()}
  `;

  const html = emailWrapper(content, "#b91c1c");
  await sendEmail(userEmail, subject, text, html);
}

async function sendCreditEmail(userEmail, name, amount, toAccount) {
  const subject = "Credit Alert!";
  const toLast6 = String(toAccount).slice(-6);

  const text = `Hello ${name},\n\nAn amount of ₹${amount} has been credited to your account ••••${toLast6}.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Credit Alert", `₹${amount} Received`, "#15803d")}
    ${greeting(name)}
    ${bodyText("Great news — your account has been credited. The funds are now available for use.")}
    ${infoTable(
      infoRow(
        "Amount Credited",
        `₹${Number(amount).toLocaleString("en-IN")}`,
        true,
      ) +
        infoRow("To Account", `••••${toLast6}`) +
        infoRow(
          "Date & Time",
          new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        ) +
        infoRow("Status", statusBadge("Credited", "#15803d", "#f0fdf4")),
    )}
    ${bodyText("Your updated balance reflects this credit. Log in to your Banking Ledger dashboard to view your full statement.")}
    ${signOff()}
  `;

  const html = emailWrapper(content, "#15803d");
  await sendEmail(userEmail, subject, text, html);
}

async function sendLoginAlertEmail(userEmail, name, ipAddress, location) {
  const subject = "Login Alert from Banking Ledger";

  const text = `Hello ${name},\n\nWe noticed a login to your Banking Ledger account from IP address ${ipAddress} located in ${location}.\n\nIf this was you, no further action is needed. If you did not log in, please secure your account immediately.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Login Alert", "New Login Detected", "#2563eb")}
    ${greeting(name)}
    ${bodyText("We detected a login to your account. Please review the details below:")}
    ${infoTable(
      infoRow("IP Address", ipAddress) +
        infoRow("Location", location) +
        infoRow(
          "Date & Time",
          new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        ) +
        infoRow(
          "Status",
          statusBadge("Successful Login", "#2563eb", "#eff6ff"),
        ),
    )}
    ${bodyText("If this was you, no further action is needed. If you did not log in, please secure your account immediately by changing your password and contacting support.")}
    ${signOff()}
  `;

  const html = emailWrapper(content, "#2563eb");
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegisterEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
  sendCreditEmail,
  sendLoginAlertEmail,
};
