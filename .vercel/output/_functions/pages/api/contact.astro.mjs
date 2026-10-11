import { z } from 'zod';
import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const payloadSchema = z.object({
  email: z.email("Please enter a valid email address.").max(200),
  message: z.string().trim().min(10, "Your message must be at least 10 characters.").max(2e3, "Your message must be 2000 characters or fewer."),
  // Honeypot — must stay empty. Bots fill it, humans never see it.
  company: z.string().max(200).optional().default("")
});
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1e3;
const rateHits = /* @__PURE__ */ new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  if (rateHits.size > 5e3) {
    for (const [key, stamps] of rateHits) {
      if (stamps.every((stamp) => now - stamp >= RATE_LIMIT_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return false;
}
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" }
});
function escapeHtml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}
const POST = async ({ request, clientAddress }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }, 400);
  }
  const { email, message, company } = parsed.data;
  if (company.trim().length > 0) {
    return json({ ok: true });
  }
  if (!apiKey || !to) {
    console.warn(
      `[contact] Resend not configured — message NOT actually sent. replyTo="${email}" message="${message}"`
    );
    return json({ ok: true });
  }
  const ip = clientAddress || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return json({ ok: false, error: "Too many messages. Please try again in a few minutes." }, 429);
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: "New message from your portfolio",
      text: `From: ${email}

${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`
    });
    if (error) {
      return json({ ok: false, error: "Could not send your message. Please try again." }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Could not send your message. Please try again." }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
