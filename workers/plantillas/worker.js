/**
 * ARSNOIR · Plantillas — intermediary between the store and Replicate.
 *
 * The theme never sees the Replicate token: it sends the customer's photo here, this Worker
 * starts the prediction on Replicate with the template's reference image and a fixed prompt,
 * and the theme polls until the illustration is ready.
 *
 *   POST /preview        { template, name?, image: "data:image/jpeg;base64,..." } -> { id }
 *   GET  /preview/:id    -> { status: "starting|processing|succeeded|failed", url? }
 *
 *   POST /keep           { id } -> { url }   copy of a finished preview that never expires (KV binding KEEP)
 *   GET  /img/:id.png    that copy (public, for the order and the store)
 *   GET  /stats          counter page: illustrations started / added to the cart per day and template
 *                        (only counts, never photos; uses the KEEP or LIMITS KV binding; ?k=STATS_KEY if set)
 *
 * Replicate's own links expire after about an hour, so the link saved in the order must be a copy:
 * - KV binding KEEP (no card needed): every finished preview is copied for 7 days (poll returns it
 *   as `saved`), and the theme calls /keep when the work goes to the cart to keep it for good.
 *   The order keeps /img/<id>.png.
 * - or an R2 bucket (PREVIEWS + PUBLIC_BASE): every finished preview is copied there.
 *
 * Secrets / vars (set them in Cloudflare, never in the theme):
 *   REPLICATE_API_TOKEN   secret
 *   ALLOWED_ORIGINS       comma-separated store origins, e.g. https://arsnoir.com,https://xxxx.myshopify.com
 *   MODEL                 Replicate model, default google/nano-banana
 *   PUBLIC_BASE           public URL of the R2 bucket, e.g. https://plantillas.arsnoir.com
 *   DAILY_LIMIT           previews per visitor per day, default 6 (needs the LIMITS KV binding)
 */
import { TEMPLATES } from './templates.js';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/* Lettering the customer can choose (the key travels from the theme; the description goes to the model) */
const FONTS = {
  pincel: 'bold hand-painted brush capital letters',
  manuscrita: 'elegant flowing handwritten script lettering',
  clasica: 'classic elegant serif capital letters',
  moderna: 'clean modern sans-serif capital letters with wide letter spacing'
};

/* Counter: plain numbers per day (Madrid time) and template, kept in KV for 120 days */
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
const count = async (kv, what, tpl) => {
  if (!kv) return;
  try {
    const key = 's:' + today() + ':' + what + ':' + (tpl || '-');
    const n = parseInt((await kv.get(key)) || '0', 10);
    await kv.put(key, String(n + 1), { expirationTtl: 120 * 24 * 3600 });
  } catch (e) { /* the counter never blocks a preview */ }
};
const statsPage = async (kv) => {
  const rows = {};
  let cursor;
  do {
    const list = await kv.list({ prefix: 's:', cursor });
    for (const k of list.keys) {
      const [, day, what, tpl] = k.name.split(':');
      const n = parseInt((await kv.get(k.name)) || '0', 10);
      const r = (rows[day + '|' + tpl] = rows[day + '|' + tpl] || { day, tpl, made: 0, cart: 0 });
      if (what === 'made') r.made += n;
      if (what === 'cart') r.cart += n;
    }
    cursor = list.list_complete ? null : list.cursor;
  } while (cursor);
  const list = Object.values(rows).sort((a, b) => (b.day + b.tpl).localeCompare(a.day + a.tpl));
  const days = {};
  list.forEach((r) => { const d = (days[r.day] = days[r.day] || { made: 0, cart: 0 }); d.made += r.made; d.cart += r.cart; });
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const tr = (cells, tag = 'td') => '<tr>' + cells.map((c) => '<' + tag + '>' + esc(c) + '</' + tag + '>').join('') + '</tr>';
  const html = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>ARSNOIR · contador</title><style>body{font:15px system-ui,sans-serif;margin:24px;color:#0a0a0a;background:#f4f4f3}' +
    'h1{font-size:20px}h2{font-size:16px;margin-top:28px}table{border-collapse:collapse;width:100%;max-width:640px;background:#fff}' +
    'td,th{padding:8px 10px;border-bottom:1px solid #e2e2e0;text-align:left}th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#6b6b6b}</style>' +
    '<h1>Ilustraciones generadas</h1><p>Hoy (' + today() + '): <b>' + ((days[today()] || {}).made || 0) + '</b> generadas · <b>' + ((days[today()] || {}).cart || 0) + '</b> al carrito</p>' +
    '<h2>Por día</h2><table>' + tr(['Día', 'Generadas', 'Al carrito'], 'th') +
    Object.keys(days).sort().reverse().map((d) => tr([d, days[d].made, days[d].cart])).join('') + '</table>' +
    '<h2>Por plantilla</h2><table>' + tr(['Día', 'Plantilla', 'Generadas', 'Al carrito'], 'th') +
    list.map((r) => tr([r.day, r.tpl, r.made, r.cart])).join('') + '</table>';
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(request.url);

    // Kept illustrations: public, so the order link and the store can always show them
    const img = url.pathname.match(/^\/img\/([a-z0-9]+)\.png$/i);
    if (request.method === 'GET' && img) {
      const file = env.KEEP ? await env.KEEP.get(img[1] + '.png', { type: 'stream' }) : null;
      if (!file) return new Response('Not found', { status: 404 });
      return new Response(file, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable', 'Access-Control-Allow-Origin': '*' } });
    }

    // Counter page (no photos, only numbers)
    if (request.method === 'GET' && url.pathname === '/stats') {
      const kv = env.KEEP || env.LIMITS;
      if (!kv) return new Response('Falta el KV (KEEP o LIMITS)', { status: 501 });
      if (env.STATS_KEY && url.searchParams.get('k') !== env.STATS_KEY) return new Response('Not found', { status: 404 });
      return statsPage(kv);
    }

    if (!allowed.includes(origin)) return json({ error: 'origin' }, 403);
    if (!env.REPLICATE_API_TOKEN) return json({ error: 'not_configured' }, 503);

    const replicate = (path, init = {}) =>
      fetch('https://api.replicate.com/v1' + path, {
        ...init,
        headers: { Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN, 'Content-Type': 'application/json', ...(init.headers || {}) }
      });

    // Start a preview
    if (request.method === 'POST' && url.pathname === '/preview') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
      const tpl = TEMPLATES[body.template];
      if (!tpl) return json({ error: 'template' }, 400);
      const image = String(body.image || '');
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > MAX_IMAGE_BYTES * 1.37) {
        return json({ error: 'image' }, 400);
      }
      const name = String(body.name || '').replace(/[^\p{L}\p{N} '\-&.!]/gu, '').trim().slice(0, 24);
      if (tpl.needsName && !name) return json({ error: 'name' }, 400);

      // Per-visitor daily limit (optional KV binding LIMITS)
      if (env.LIMITS) {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const key = 'n:' + new Date().toISOString().slice(0, 10) + ':' + ip;
        const used = parseInt((await env.LIMITS.get(key)) || '0', 10);
        if (used >= parseInt(env.DAILY_LIMIT || '6', 10)) return json({ error: 'limit' }, 429);
        await env.LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });
      }

      /* Font and colour only from the template's own lists: nothing free-form reaches the prompt */
      const font = FONTS[body.font] ? body.font : (tpl.font || 'pincel');
      const colors = tpl.colors || {};
      const color = colors[body.color] ? body.color : Object.keys(colors)[0];
      const shown = font === 'manuscrita' ? name : name.toUpperCase();
      const fill = (t) => t.split('{NAME}').join(shown).split('{FONT}').join(FONTS[font]).split('{COLOR}').join(color ? colors[color] : '');
      let prompt = fill(tpl.prompt);
      if (!tpl.needsName && name && tpl.textPrompt) prompt += ' ' + fill(tpl.textPrompt);
      const model = env.MODEL || 'google/nano-banana';
      const res = await replicate('/models/' + model + '/predictions', {
        method: 'POST',
        body: JSON.stringify({ input: { prompt, image_input: tpl.refFirst ? [tpl.reference, image] : [image, tpl.reference], output_format: 'png', aspect_ratio: tpl.aspectRatio || '4:5' } })
      });
      const data = await res.json();
      if (!res.ok || !data.id) return json({ error: 'replicate', detail: data.detail || null }, 502);
      await count(env.KEEP || env.LIMITS, 'made', body.template);
      return json({ id: data.id });
    }

    // Poll a preview
    const m = url.pathname.match(/^\/preview\/([a-z0-9]+)$/i);
    if (request.method === 'GET' && m) {
      const res = await replicate('/predictions/' + m[1]);
      const data = await res.json();
      if (!res.ok) return json({ error: 'replicate' }, 502);
      if (data.status !== 'succeeded') return json({ status: data.status });
      const out = Array.isArray(data.output) ? data.output[0] : data.output;
      if (!out) return json({ status: 'failed' });
      // Keep a permanent copy for the order
      if (env.PREVIEWS && env.PUBLIC_BASE) {
        const key = 'previews/' + m[1] + '.png';
        const existing = await env.PREVIEWS.head(key);
        if (!existing) {
          const img = await fetch(out);
          if (img.ok) await env.PREVIEWS.put(key, img.body, { httpMetadata: { contentType: 'image/png' } });
        }
        return json({ status: 'succeeded', url: env.PUBLIC_BASE.replace(/\/$/, '') + '/' + key });
      }
      // KEEP: a copy for 7 days right away, so the order never depends on Replicate's 1-hour link
      // even if /keep fails at the cart; /keep makes it permanent. The screen shows Replicate's link
      // (a fresh KV write can take a moment to be readable everywhere).
      let saved = '';
      if (env.KEEP) {
        const key = m[1] + '.png';
        try {
          const existing = await env.KEEP.get(key, { type: 'stream' });
          if (existing) { await existing.cancel(); saved = url.origin + '/img/' + key; }
          else {
            const file = await fetch(out);
            if (file.ok) { await env.KEEP.put(key, await file.arrayBuffer(), { expirationTtl: 7 * 24 * 3600 }); saved = url.origin + '/img/' + key; }
          }
        } catch (e) { saved = ''; }
      }
      return json({ status: 'succeeded', url: out, saved, temporary: true, keep: !!env.KEEP });
    }

    // Keep a finished preview for good (called when the work goes to the cart)
    if (request.method === 'POST' && url.pathname === '/keep') {
      if (!env.KEEP) return json({ error: 'no_store' }, 501);
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
      const id = String(body.id || '');
      if (!/^[a-z0-9]{8,64}$/i.test(id)) return json({ error: 'id' }, 400);
      if (body.first !== false) await count(env.KEEP || env.LIMITS, 'cart', TEMPLATES[body.template] ? body.template : '-');
      // Already copied when it was made: store it again without the 7-day expiry
      const copy = await env.KEEP.get(id + '.png', { type: 'arrayBuffer' });
      if (copy) {
        await env.KEEP.put(id + '.png', copy);
        return json({ url: url.origin + '/img/' + id + '.png' });
      }
      const res = await replicate('/predictions/' + id);
      const data = await res.json();
      if (!res.ok || data.status !== 'succeeded') return json({ error: 'not_ready' }, 409);
      const out = Array.isArray(data.output) ? data.output[0] : data.output;
      const file = out ? await fetch(out) : null;
      if (!file || !file.ok) return json({ error: 'expired' }, 410);
      await env.KEEP.put(id + '.png', await file.arrayBuffer());
      return json({ url: url.origin + '/img/' + id + '.png' });
    }

    return json({ error: 'not_found' }, 404);
  }
};
