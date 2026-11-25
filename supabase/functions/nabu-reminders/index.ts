// Supabase Edge Function: nabu-reminders
//
// - GET  ?action=vapid       -> the public push key the app needs to turn
//                               notifications on (keys are created once,
//                               automatically, and kept in public.push_vapid)
// - POST {"action":"tick"}   -> called every minute by pg_cron: sends the
//                               reminders that are due right now
// - POST {"action":"test"}   -> (logged-in user) sends a test notification
//                               to that user's devices
//
// Uses SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (provided by Supabase).
// "Verify JWT" must be OFF for this function (pg_cron calls it).
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const APP_URL = "https://lalogia.pro/index15budgetingapphtml.html";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// ---- LOGIC (pure, no network) ----------------------------------------
// The user's local date ("YYYY-MM-DD") and minutes since midnight
function localNow(tz: string, now = new Date()) {
  let parts: Record<string, string> = {};
  try {
    parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
      timeZone: tz || "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(now).map((p) => [p.type, p.value]));
  } catch (_) {
    return localNow("America/Bogota", now);
  }
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function parseStart(timeRange: unknown): number | null {
  if (typeof timeRange !== "string") return null;
  const m = timeRange.match(/^(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

type Due = { key: string; title: string; body: string };
// What should be sent right now for one user. A reminder is "due" from its
// moment until 5 minutes later (so a missed minute isn't lost); the
// push_sent table makes sure each one is only sent once.
function dueReminders(appData: any, settings: any, tz: string, now = new Date()): Due[] {
  // general reminders are opt-in; reminders set on an activity always count
  const s = { enabled: false, before: 10, which: "all", daily: false, dailyTime: "20:00", ...(settings || {}) };
  const { date, minutes } = localNow(tz, now);
  const blocks: any[] = (appData && appData.timeData && appData.timeData[date]) || [];
  const out: Due[] = [];
  const before = Math.max(0, Number(s.before) || 0);
  for (const b of blocks) {
    if (!b || (b.liveTimer && !b.liveTimer.finished)) continue;
    // a reminder set on this activity always counts; otherwise the general setting
    const own = b.remind !== undefined && b.remind !== null;
    if (!own && (!s.enabled || (s.which === "planned" && b.type !== "projected"))) continue;
    const mins = own ? Math.max(0, Number(b.remind) || 0) : before;
    const start = parseStart(b.timeRange);
    if (start === null) continue;
    const at = start - mins;
    if (minutes >= at && minutes <= at + 5 && minutes <= start + 1) {
      const name = (b.name && String(b.name).trim()) || b.category || "Activity";
      out.push({
        key: `${date}|${start}|${name}|${mins}`,
        title: `⏰ ${b.category || "Nabu"}`,
        body: mins ? `${name} starts in ${mins} min (${hhmm(start)})` : `${name} starts now (${hhmm(start)})`,
      });
    }
  }
  if (s.enabled && s.daily) {
    const daily = parseStart(s.dailyTime);
    const loggedSomething = blocks.some((b: any) => b && b.type !== "projected");
    if (daily !== null && minutes >= daily && minutes <= daily + 5 && !loggedSomething) {
      out.push({ key: `${date}|daily`, title: "📝 Nabu", body: "You haven't logged anything today. Take a minute to add what you did." });
    }
  }
  return out;
}
// ---- END LOGIC --------------------------------------------------------

async function vapidKeys() {
  const { data } = await db.from("push_vapid").select("public_key, private_key").eq("id", 1).maybeSingle();
  if (data) return data;
  const k = webpush.generateVAPIDKeys();
  const row = { id: 1, public_key: k.publicKey, private_key: k.privateKey };
  const { error } = await db.from("push_vapid").insert(row);
  if (error) { // created at the same moment by another call
    const { data: again } = await db.from("push_vapid").select("public_key, private_key").eq("id", 1).maybeSingle();
    return again!;
  }
  return row;
}

async function sendTo(sub: any, payload: Record<string, unknown>) {
  try {
    await webpush.sendNotification(sub.subscription, JSON.stringify(payload), { TTL: 600 });
    return true;
  } catch (err: any) {
    // the device unsubscribed / the subscription expired: forget it
    if (err && (err.statusCode === 404 || err.statusCode === 410)) await db.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
    else console.error("push failed:", err && (err.statusCode || err.message));
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  const keys = await vapidKeys();
  if (req.method === "GET") {
    if (url.searchParams.get("action") === "vapid") return json({ publicKey: keys.public_key });
    return json({ ok: true });
  }
  webpush.setVapidDetails("mailto:defytheoddsfractal@gmail.com", keys.public_key, keys.private_key);
  let body: any = {};
  try { body = await req.json(); } catch (_) { /* empty */ }

  if (body.action === "test") {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u } = await db.auth.getUser(token);
    if (!u || !u.user) return json({ error: "not logged in" }, 401);
    const { data: subs } = await db.from("push_subscriptions").select("*").eq("user_id", u.user.id);
    let sent = 0;
    for (const sub of subs || []) if (await sendTo(sub, { title: "🔔 Nabu", body: "Notifications are working on this device.", url: APP_URL })) sent++;
    return json({ sent, devices: (subs || []).length });
  }

  // tick: send everything that's due
  const { data: subs } = await db.from("push_subscriptions").select("*");
  const byUser = new Map<string, any[]>();
  for (const s of subs || []) byUser.set(s.user_id, [...(byUser.get(s.user_id) || []), s]);
  let sent = 0;
  for (const [userId, userSubs] of byUser) {
    const { data: row } = await db.from("user_data").select("app_data").eq("user_id", userId).maybeSingle();
    const first = userSubs[0];
    const due = dueReminders(row && row.app_data, first.settings, first.tz);
    for (const d of due) {
      const { error } = await db.from("push_sent").insert({ user_id: userId, key: d.key });
      if (error) continue; // already sent
      for (const sub of userSubs) if (await sendTo(sub, { title: d.title, body: d.body, url: APP_URL, tag: d.key })) sent++;
    }
  }
  // keep the "already sent" list small
  await db.from("push_sent").delete().lt("sent_at", new Date(Date.now() - 3 * 864e5).toISOString());
  return json({ ok: true, users: byUser.size, sent });
});
