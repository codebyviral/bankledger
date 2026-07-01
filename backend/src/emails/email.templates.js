// ─────────────────────────────────────────────────────────────────────────────
// Banking Ledger — Email Templates
// Pure content builders: pass params in, get { subject, text, html } back.
// No mail-sending logic lives here — wire the output into Resend, Nodemailer,
// or anything else in your controller.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Theme ─────────────────────────────────────────────────────────────────
// Deep navy / slate base with a confident blue accent (trust + readability),
// green reserved for success states.
const THEME = {
  bg: "#eef1f6",
  surface: "#ffffff",
  border: "#dde3ee",
  textPrimary: "#1c2536",
  textSecondary: "#4b5670",
  textMuted: "#8893a8",
  accent: "#2451c4",
  success: "#1b8a5a",
  successBg: "#eafbf2",
  alert: "#c43d2e",
  alertBg: "#fdecea",
};

// ─── Responsive Styles ────────────────────────────────────────────────────
// Mobile clients that support <style> (Apple Mail, Gmail app, Outlook app,
// most modern webmail) will pick these up. Tables still use fluid
// width:100%/max-width so layout degrades gracefully even where <style>
// in <head> is stripped (some webmail clients).
const responsiveStyles = `
  <style>
    body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }

    .bl-wrapper { width: 100%; background-color: ${THEME.bg}; }
    .bl-container { width: 100%; max-width: 600px; }
    .bl-outer-padding { padding: 48px 16px; }
    .bl-header { padding: 28px 36px 24px; }
    .bl-card { padding: 40px 36px 36px; }
    .bl-heading-title { font-size: 28px; }
    .bl-body-text { font-size: 16px; }
    .bl-info-label { padding: 14px 16px; font-size: 13px; white-space: nowrap; }
    .bl-info-value { padding: 14px 16px; font-size: 16px; }
    .bl-secure-tag { display: inline-block; }

    @media only screen and (max-width: 600px) {
      .bl-outer-padding { padding: 24px 12px !important; }
      .bl-header { padding: 22px 20px 18px !important; }
      .bl-card { padding: 28px 20px 26px !important; }
      .bl-heading-title { font-size: 22px !important; line-height: 1.3 !important; }
      .bl-body-text { font-size: 15px !important; }
      .bl-secure-tag { display: none !important; }
      .bl-brand-name { font-size: 16px !important; }
    }

    @media only screen and (max-width: 480px) {
      .bl-info-row { display: block !important; width: 100% !important; }
      .bl-info-label {
        display: block !important;
        width: 100% !important;
        border-bottom: none !important;
        padding: 14px 16px 4px !important;
        color: ${THEME.textMuted} !important;
      }
      .bl-info-value {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        padding: 0 16px 14px !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      .bl-dark-bg { background-color: ${THEME.bg} !important; }
    }
  </style>
`;

// ─── Shared Layout Wrapper ────────────────────────────────────────────────────
const emailWrapper = (content, accentColor = THEME.accent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Banking Ledger</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  ${responsiveStyles}
</head>
<body class="bl-dark-bg" style="
  margin: 0;
  padding: 0;
  background-color: ${THEME.bg};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: ${THEME.textPrimary};
  -webkit-font-smoothing: antialiased;
">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="bl-wrapper">
    <tr>
      <td align="center" class="bl-outer-padding">
        <table role="presentation" width="100%" class="bl-container" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Header / Logo bar -->
          <tr>
            <td class="bl-header" style="
              background-color: ${THEME.surface};
              border: 1px solid ${THEME.border};
              border-bottom: none;
              border-radius: 12px 12px 0 0;
            ">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span class="bl-secure-tag" style="
                      font-size: 13px;
                      font-weight: 800;
                      letter-spacing: 0.04em;
                      color: #ffffff;
                      background-color: ${accentColor};
                      padding: 6px 12px;
                      border-radius: 6px;
                      line-height: 1;
                    ">BL</span>
                    <span class="bl-brand-name" style="
                      font-size: 17px;
                      font-weight: 700;
                      color: ${THEME.textPrimary};
                      margin-left: 12px;
                      vertical-align: middle;
                    ">Banking Ledger</span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span class="bl-secure-tag" style="
                      font-size: 12px;
                      font-weight: 600;
                      letter-spacing: 0.04em;
                      text-transform: uppercase;
                      color: ${THEME.textMuted};
                    ">Secure &bull; Reliable</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr>
            <td style="height: 4px; background-color: ${accentColor};"></td>
          </tr>

          <!-- Main content card -->
          <tr>
            <td class="bl-card" style="
              background-color: ${THEME.surface};
              border: 1px solid ${THEME.border};
              border-top: none;
              border-radius: 0 0 12px 12px;
            ">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 8px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    border-top: 1px solid ${THEME.border};
                    padding-top: 18px;
                    font-size: 12px;
                    color: ${THEME.textMuted};
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
  <p class="bl-body-text" style="
    margin: 0 0 24px;
    font-size: 16px;
    color: ${THEME.textSecondary};
  ">Hello, <strong style="color: ${THEME.textPrimary};">${name}</strong></p>
`;

const divider = () => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
    <tr><td style="height: 1px; background-color: ${THEME.border};"></td></tr>
  </table>
`;

const infoRow = (label, value, highlight = false) => `
  <tr class="bl-info-row">
    <td class="bl-info-label" style="
      padding: 14px 16px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: ${THEME.textMuted};
      white-space: nowrap;
      border-bottom: 1px solid ${THEME.border};
    ">${label}</td>
    <td class="bl-info-value" style="
      padding: 14px 16px;
      font-size: 16px;
      font-weight: ${highlight ? "700" : "500"};
      color: ${highlight ? THEME.accent : THEME.textPrimary};
      border-bottom: 1px solid ${THEME.border};
      word-break: break-all;
      text-align: right;
    ">${value}</td>
  </tr>
`;

const infoTable = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
    border: 1px solid ${THEME.border};
    border-radius: 8px;
    border-collapse: separate;
    overflow: hidden;
    margin: 24px 0;
  ">
    <tbody>${rows}</tbody>
  </table>
`;

const statusBadge = (text, color, bg) => `
  <span style="
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${color};
    background-color: ${bg};
    padding: 6px 12px;
    border-radius: 999px;
    line-height: 1.4;
  ">${text}</span>
`;

const headingBlock = (label, title, accentColor = THEME.accent) => `
  <div style="margin-bottom: 28px;">
    <div style="
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${accentColor};
      font-weight: 700;
      margin-bottom: 10px;
    ">${label}</div>
    <div class="bl-heading-title" style="
      font-size: 28px;
      font-weight: 800;
      color: ${THEME.textPrimary};
      letter-spacing: -0.01em;
      line-height: 1.25;
    ">${title}</div>
  </div>
`;

const bodyText = (text) => `
  <p class="bl-body-text" style="
    margin: 0 0 18px;
    font-size: 16px;
    line-height: 1.7;
    color: ${THEME.textSecondary};
  ">${text}</p>
`;

const signOff = () => `
  <p style="
    margin: 32px 0 0;
    font-size: 14px;
    color: ${THEME.textMuted};
    line-height: 1.6;
  ">
    Best regards,<br />
    <strong style="color: ${THEME.textPrimary};">The Banking Ledger Team</strong>
  </p>
`;

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatRupees = (amount) =>
  `\u20b9${Number(amount).toLocaleString("en-IN")}`;

const formatDateTime = (date = new Date()) =>
  date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const maskAccount = (accountNumber) =>
  `\u2022\u2022\u2022\u2022${String(accountNumber).slice(-6)}`;

// ─── Email Content Builders ───────────────────────────────────────────────────
// Each returns { subject, text, html }. Call signature is a single params
// object so call sites stay readable as fields grow.

/**
 * buildWelcomeEmail({ name, email })
 */
function buildWelcomeEmail({ name, email }) {
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
        statusBadge("Account Active", THEME.success, THEME.successBg),
      ) +
        infoRow("Registered Email", email) +
        infoRow("Member Since", formatDateTime().split(",")[0]),
    )}
    ${bodyText("If you did not create this account, please contact our support team immediately.")}
    ${signOff()}
  `;

  return { subject, text, html: emailWrapper(content, THEME.accent) };
}

/**
 * buildTransactionEmail({ name, amount, fromAccount, toAccount })
 */
function buildTransactionEmail({ name, amount, fromAccount, toAccount }) {
  const subject = "Transaction Alert!";
  const amountFormatted = formatRupees(amount);

  const text = `Hello ${name},\n\nA transaction of ${amountFormatted} has been made from account ${maskAccount(fromAccount)} to account ${maskAccount(toAccount)}.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Transaction Alert", `${amountFormatted} Transferred`, THEME.accent)}
    ${greeting(name)}
    ${bodyText("A fund transfer has been successfully processed on your account. Please review the details below.")}
    ${infoTable(
      infoRow("Amount", amountFormatted, true) +
        infoRow("From Account", maskAccount(fromAccount)) +
        infoRow("To Account", maskAccount(toAccount)) +
        infoRow("Date & Time", formatDateTime()) +
        infoRow(
          "Status",
          statusBadge("Success", THEME.success, THEME.successBg),
        ),
    )}
    ${bodyText("If you did not initiate this transaction, please contact support immediately and secure your account.")}
    ${signOff()}
  `;

  return { subject, text, html: emailWrapper(content, THEME.accent) };
}

/**
 * buildLoginDetectedEmail({ name, device, location, time, ipAddress })
 * `time` is optional — defaults to now.
 */
function buildLoginDetectedEmail({ name, device, location, time, ipAddress }) {
  const subject = "New Login Detected";
  const loginTime = formatDateTime(time ? new Date(time) : new Date());

  const text = `Hello ${name},\n\nWe noticed a new login to your Banking Ledger account.\n\nDevice: ${device}\nLocation: ${location}\nTime: ${loginTime}\nIP Address: ${ipAddress}\n\nIf this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.\n\nBest regards,\nThe Banking Ledger Team`;

  const content = `
    ${headingBlock("Security Alert", "New login detected.", THEME.alert)}
    ${greeting(name)}
    ${bodyText("We noticed a new sign-in to your Banking Ledger account. If this was you, there's nothing more to do.")}
    ${infoTable(
      infoRow("Device", device) +
        infoRow("Location", location) +
        infoRow("Time", loginTime) +
        infoRow("IP Address", ipAddress) +
        infoRow(
          "Status",
          statusBadge("Unrecognized?", THEME.alert, THEME.alertBg),
        ),
    )}
    ${bodyText("If you don't recognize this activity, please reset your password and contact support right away.")}
    ${signOff()}
  `;

  return { subject, text, html: emailWrapper(content, THEME.alert) };
}

module.exports = {
  buildWelcomeEmail,
  buildTransactionEmail,
  buildLoginDetectedEmail,
};
