import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface ContactEmailPayload {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailPayload) {
  const { name, email, projectType, budget, message } = data;
  const senderName = process.env.GMAIL_SENDER_NAME || "Niloy Kundu";
  const gmailUser = process.env.GMAIL_USER!;

  // ── 1. Notification email sent TO you ─────────────────────────────────────
  // Plain, personal-looking email avoids spam filters
  await transporter.sendMail({
    from: `"${senderName}" <${gmailUser}>`,
    to: gmailUser,
    replyTo: `"${name}" <${email}>`,
    subject: `New project inquiry from ${name}`,
    // Plain text version (very important for spam score)
    text: [
      `New project inquiry from your portfolio`,
      ``,
      `Name:         ${name}`,
      `Email:        ${email}`,
      `Project Type: ${projectType || "Not specified"}`,
      `Budget:       ${budget || "Not specified"}`,
      ``,
      `Message:`,
      message,
      ``,
      `---`,
      `Reply directly to this email to respond to ${name}.`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
        <p style="font-size:14px;color:#555;margin-bottom:24px;">
          New message from your portfolio contact form
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:120px;font-size:13px;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;">
              <a href="mailto:${email}" style="color:#b8862e;text-decoration:none;">${email}</a>
            </td>
          </tr>
          ${projectType ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Project</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;">${projectType}</td>
          </tr>` : ""}
          ${budget ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Budget</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;">${budget}</td>
          </tr>` : ""}
        </table>

        <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-left:3px solid #b8862e;">
          <p style="margin:0 0 6px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
          <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;color:#1a1a1a;">${message}</p>
        </div>

        <p style="margin-top:24px;font-size:13px;color:#aaa;">
          Hit reply to respond directly to ${name}.
        </p>
      </div>
    `,
  });

  // ── 2. Thank-you email sent TO the client ─────────────────────────────────
  // Personal tone, plain language, no spam trigger phrases
  const firstName = name.split(" ")[0];
  await transporter.sendMail({
    from: `"${senderName}" <${gmailUser}>`,
    to: `"${name}" <${email}>`,
    subject: `Got your message, ${firstName} — I'll be in touch soon`,
    text: [
      `Hey ${firstName},`,
      ``,
      `Thanks for getting in touch! I've received your message and will`,
      `get back to you within 24 hours.`,
      ``,
      `Here's a quick recap of what you sent:`,
      projectType ? `Project type: ${projectType}` : "",
      budget ? `Budget: ${budget}` : "",
      ``,
      message.substring(0, 300) + (message.length > 300 ? "..." : ""),
      ``,
      `Talk soon,`,
      senderName,
    ].filter(Boolean).join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;font-size:15px;line-height:1.7;">
        <p>Hey ${firstName},</p>

        <p>
          Thanks for getting in touch! I've received your message and
          will get back to you within <strong>24 hours</strong>.
        </p>

        <p>Here's a quick recap of what you sent:</p>

        <div style="padding:16px 20px;background:#f9f9f9;border-left:3px solid #b8862e;margin:20px 0;">
          ${projectType ? `<p style="margin:4px 0;font-size:13px;color:#555;">Project: <strong style="color:#1a1a1a;">${projectType}</strong></p>` : ""}
          ${budget ? `<p style="margin:4px 0;font-size:13px;color:#555;">Budget: <strong style="color:#1a1a1a;">${budget}</strong></p>` : ""}
          <p style="margin:${projectType || budget ? "12px" : "0"} 0 0;font-size:14px;color:#444;white-space:pre-wrap;">
            ${message.substring(0, 300)}${message.length > 300 ? "…" : ""}
          </p>
        </div>

        <p>Talk soon,<br><strong>${senderName}</strong></p>
      </div>
    `,
  });
}
