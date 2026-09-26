/**
 * Quick email test — run with:
 *   npx tsx scripts/test-email.ts
 *
 * Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env.local first.
 */

import { config } from "dotenv";
import path from "path";

// Load .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || user === "your@gmail.com") {
    console.error("❌ GMAIL_USER is not set in .env.local");
    process.exit(1);
  }
  if (!pass) {
    console.error("❌ GMAIL_APP_PASSWORD is not set in .env.local");
    process.exit(1);
  }

  console.log(`📧 Sending test email from: ${user}`);
  console.log(`📬 Sending test email to:   ${user}`);

  // Dynamically import nodemailer after env is loaded
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${user}>`,
      to: user,
      subject: "✅ Portfolio Email Test — It Works!",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;background:#0f0f0f;color:#f0f0f0;border-radius:8px;">
          <h2 style="color:#c9a84c;">✅ Email is working!</h2>
          <p>Your portfolio contact form can now send emails successfully.</p>
          <p style="color:#888;font-size:13px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Check your inbox at:", user);
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException & { code?: string; responseCode?: number; response?: string };
    console.error("❌ Failed to send email:");
    console.error("   Error:", error.message);
    if (error.responseCode === 535 || error.code === "EAUTH") {
      console.error("\n   💡 Fix: The App Password is wrong or 2-Step Verification is not enabled.");
      console.error("   Go to: https://myaccount.google.com/apppasswords and generate a new one.");
    }
    process.exit(1);
  }
}

main();
