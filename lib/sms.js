// Sends the verification code by SMS. Activates when a provider key is set.
// Termii (popular in Africa): set TERMII_API_KEY (and optional TERMII_SENDER_ID).
// With no key this returns { sent:false } and email/on-screen code is used.

export async function sendOtpSms(phone, code) {
  const key = process.env.TERMII_API_KEY;
  if (!key || !phone) return { sent: false, reason: "no-provider" };
  const from = process.env.TERMII_SENDER_ID || "Hineed";
  try {
    const r = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, from, sms: `Your Hineed code is ${code}`, type: "plain", channel: "generic", api_key: key }),
    });
    return { sent: r.ok };
  } catch {
    return { sent: false };
  }
}
