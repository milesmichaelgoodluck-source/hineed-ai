import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hineed AI concierge, powered by the Anthropic (Claude) API.
// Add ANTHROPIC_API_KEY on the host to switch it fully live. Without a key it
// returns a helpful fallback so the chat still works.
const SYSTEM = `You are the Hineed.AI concierge — a warm, concise assistant inside the Hineed super-app.
Hineed helps people get things done anywhere in the world: find and book local service providers (cleaners, painters, plumbers, electricians, etc.), order products from local shops, hire talent, find homes and rentals, order food, move/send things, and pay securely with escrow.
Help the user figure out what they need and point them to the right part of the app (Services, Marketplace/Shops, Hineed Pay, Hineed You/social, Jobs, Real estate). Keep answers short (2-4 sentences), friendly and practical. If they describe a need, suggest the next step (e.g. "Browse Services and tap Book"). Don't invent prices or specific businesses.`;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { body = {}; }

  let messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length && body.message) messages = [{ role: "user", content: String(body.message) }];
  messages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
    .slice(-12)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
  if (!messages.length) return NextResponse.json({ error: "No message." }, { status: 400 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const last = messages[messages.length - 1].content;
    return NextResponse.json({
      configured: false,
      reply:
        `Got it — "${last.slice(0, 80)}". I can point you to the right place: open **Services** to find and book a provider, **Shops** to order products, or **Hineed Pay** to send money. ` +
        `(Tip for the owner: add an ANTHROPIC_API_KEY to switch me to the full Claude AI assistant.)`,
    });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYSTEM, messages }),
    });
    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ reply: "I'm having trouble reaching my brain right now — please try again in a moment." });
    }
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim()
      || "Sorry, I didn't catch that — could you rephrase?";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "I'm having trouble connecting right now — please try again." });
  }
}
