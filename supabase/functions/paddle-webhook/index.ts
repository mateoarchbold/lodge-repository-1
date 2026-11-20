// Supabase Edge Function: paddle-webhook
//
// Paddle calls this URL every time something happens with a payment or
// subscription. It checks the message really comes from Paddle (signed
// with PADDLE_WEBHOOK_SECRET), then records the account's Pro status in
// public.subscriptions. The Nabu app reads that table to know who is Pro.
//
// Secrets it uses (set in Supabase -> Edge Functions -> Secrets):
//   PADDLE_WEBHOOK_SECRET  - from Paddle's notification destination
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY - provided by Supabase automatically
import { createClient } from "npm:@supabase/supabase-js@2";

// Paddle price IDs -> plan name (sandbox; add the live ones when going live)
const PRICE_PLANS: Record<string, string> = {
  "pri_01m7vmy1z2ncjpz65391yjnnxq": "monthly",
  "pri_01m7vmyngd8m3bzmbktdbjagzm": "yearly",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function isFromPaddle(rawBody: string, header: string | null, secret: string): Promise<boolean> {
  if (!header || !secret) return false;
  let ts = "";
  const signatures: string[] = [];
  for (const part of header.split(";")) {
    const [k, v] = part.split("=");
    if (k === "ts") ts = v;
    if (k === "h1" && v) signatures.push(v);
  }
  if (!ts || signatures.length === 0) return false;
  // Reject old messages (replays): more than 5 minutes off
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}:${rawBody}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");

  // constant-time comparison against each provided signature
  return signatures.some((sig) => {
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");

  const rawBody = await req.text();
  const ok = await isFromPaddle(rawBody, req.headers.get("Paddle-Signature"), Deno.env.get("PADDLE_WEBHOOK_SECRET") ?? "");
  if (!ok) return new Response("invalid signature", { status: 401 });

  let event: any;
  try { event = JSON.parse(rawBody); } catch { return new Response("bad json", { status: 400 }); }

  const type: string = event.event_type ?? "";
  const d = event.data ?? {};
  const occurredAt: string = event.occurred_at ?? new Date().toISOString();

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  let userId: string | undefined = d.custom_data?.user_id;
  let row: Record<string, unknown> | null = null;

  if (type.startsWith("subscription.")) {
    if (!userId && d.id) {
      // older subscriptions without custom_data: find the account by subscription id
      const { data: existing } = await db.from("subscriptions").select("user_id").eq("paddle_subscription_id", d.id).maybeSingle();
      userId = existing?.user_id;
    }
    row = {
      status: d.status,
      plan: PRICE_PLANS[d.items?.[0]?.price?.id] ?? null,
      paddle_subscription_id: d.id ?? null,
      paddle_customer_id: d.customer_id ?? null,
      current_period_end: d.current_billing_period?.ends_at ?? null,
    };
  } else if (type === "transaction.completed" && d.subscription_id) {
    row = {
      status: "active",
      plan: PRICE_PLANS[d.items?.[0]?.price?.id] ?? null,
      paddle_subscription_id: d.subscription_id,
      paddle_customer_id: d.customer_id ?? null,
      current_period_end: d.billing_period?.ends_at ?? null,
    };
  }

  if (!row) return new Response("ignored");
  if (!userId || !UUID_RE.test(userId)) return new Response("no matching account");

  // Paddle can deliver events out of order - never let an older event
  // overwrite a newer one.
  const { data: current } = await db.from("subscriptions").select("last_event_at").eq("user_id", userId).maybeSingle();
  if (current?.last_event_at && new Date(current.last_event_at) > new Date(occurredAt)) {
    return new Response("older event ignored");
  }

  const { error } = await db.from("subscriptions").upsert({
    user_id: userId,
    ...row,
    last_event_at: occurredAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) {
    console.error("Could not save subscription:", error.message);
    return new Response("db error", { status: 500 }); // Paddle will retry
  }
  return new Response("saved");
});
