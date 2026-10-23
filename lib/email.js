// Sends the verification code by email.
//
// To send REAL emails, set two environment variables on Vercel:
//   RESEND_API_KEY  — a free key from https://resend.com
//   EMAIL_FROM      — e.g. "Hineed.AI <noreply@yourdomain.com>" (a domain you
//                     verified in Resend). Until a domain is verified, Resend
//                     only delivers to the account owner's own email.
//
// With no key set, this returns { sent:false } and the calling route shows the
// code on screen (test mode) so the flow is fully usable while you set email up.

export async function sendOtpEmail(to, code) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "no-provider" };

  const from = process.env.EMAIL_FROM || "Hineed.AI <onboarding@resend.dev>";
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `Your Hineed.AI code: ${code}`,
        html:
          `<div style="font-family:Inter,Arial,sans-serif;max-width:440px;margin:auto">` +
          `<h2 style="color:#0E7C3A">Hineed.AI</h2>` +
          `<p>Your verification code is:</p>` +
          `<p style="font-size:30px;font-weight:800;letter-spacing:6px">${code}</p>` +
          `<p style="color:#667">It expires in 10 minutes. If you didn't request this, ignore this email.</p>` +
          `</div>`,
      }),
    });
    if (r.ok) return { sent: true };
    const detail = await r.text().catch(() => "");
    return { sent: false, reason: "send-failed", detail };
  } catch {
    return { sent: false, reason: "error" };
  }
}
