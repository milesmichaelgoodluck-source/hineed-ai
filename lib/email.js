// Sends the verification code by email. Two ways, in priority order:
//
//  1) GMAIL (free, no domain needed, delivers to ANY inbox).
//     Set GMAIL_USER (your gmail address) and GMAIL_APP_PASSWORD (a 16-char
//     Google "App Password", NOT your normal password). Needs 2-Step
//     Verification turned on for the Google account.
//
//  2) RESEND (resend.com). Set RESEND_API_KEY and EMAIL_FROM. Without a verified
//     sending domain, Resend only delivers to the account owner's own email.
//
// With neither set, this returns { sent:false } and the route shows the code on
// screen so sign-up still works while you set delivery up.

function codeHtml(code) {
  return (
    `<div style="font-family:Inter,Arial,sans-serif;max-width:440px;margin:auto">` +
    `<h2 style="color:#0E7C3A">Hineed.AI</h2>` +
    `<p>Your verification code is:</p>` +
    `<p style="font-size:30px;font-weight:800;letter-spacing:6px">${code}</p>` +
    `<p style="color:#667">It expires in 10 minutes. If you didn't request this, ignore this email.</p>` +
    `</div>`
  );
}

export async function sendOtpEmail(to, code) {
  // ---- 1) Gmail SMTP (free, any recipient) ----
  const gUser = process.env.GMAIL_USER;
  const gPass = process.env.GMAIL_APP_PASSWORD;
  if (gUser && gPass) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        // Google app passwords are 16 letters; strip any spaces/underscores/
        // dashes a person may have typed between the groups.
        auth: { user: gUser.trim(), pass: gPass.replace(/[^a-zA-Z0-9]/g, "") },
        connectionTimeout: 10000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
      });
      await transporter.sendMail({
        from: `Hineed.AI <${gUser}>`,
        to,
        subject: `Your Hineed.AI code: ${code}`,
        html: codeHtml(code),
      });
      return { sent: true, via: "gmail" };
    } catch (e) {
      // remember why Gmail failed, then fall through to Resend / fallback
      globalThis.__gmailErr = (e && (e.response || e.message)) ? String(e.response || e.message).slice(0, 140) : "gmail-error";
    }
  }

  // ---- 2) Resend ----
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const from = process.env.EMAIL_FROM || "Hineed.AI <onboarding@resend.dev>";
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject: `Your Hineed.AI code: ${code}`, html: codeHtml(code) }),
      });
      if (r.ok) return { sent: true, via: "resend" };
      const detail = await r.text().catch(() => "");
      return { sent: false, reason: "send-failed", detail };
    } catch {
      return { sent: false, reason: "error" };
    }
  }

  return { sent: false, reason: "no-provider" };
}
