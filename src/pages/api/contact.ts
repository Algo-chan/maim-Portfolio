import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";

// On-demand route: runs as a Vercel function, never prerendered.
export const prerender = false;

const payloadSchema = z.object({
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Your message must be at least 10 characters.")
    .max(2000, "Your message must be 2000 characters or fewer."),
  // Honeypot — must stay empty. Bots fill it, humans never see it.
  company: z.string().max(200).optional().default(""),
});

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow without bound.
  if (rateHits.size > 5000) {
    for (const [key, stamps] of rateHits) {
      if (stamps.every((stamp) => now - stamp >= RATE_LIMIT_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return false;
}

const json = (body: { ok: boolean; error?: string }, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  let payload: unknown;
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

  // Honeypot tripped: silently accept so bots learn nothing.
  if (company.trim().length > 0) {
    return json({ ok: true });
  }

  // --- Temporary demo stub -------------------------------------------------
  // Resend is configured through RESEND_API_KEY + CONTACT_TO_EMAIL (see
  // .env.example). Until those are set, log the submission server-side and
  // report success so the form works end-to-end. How to go live: add the two
  // env vars (locally in .env and in Vercel -> Environment Variables) and this
  // branch simply stops being taken — no code change required.
  if (!apiKey || !to) {
    console.warn(
      `[contact] Resend not configured — message NOT actually sent. replyTo="${email}" message="${message}"`,
    );
    return json({ ok: true });
  }
  // -------------------------------------------------------------------------

  const ip =
    clientAddress || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
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
      text: `From: ${email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    });

    if (error) {
      return json({ ok: false, error: "Could not send your message. Please try again." }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Could not send your message. Please try again." }, 500);
  }
};
