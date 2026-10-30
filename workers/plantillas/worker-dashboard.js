// Single-file build for pasting in the Cloudflare dashboard (generated from worker.js + templates.js).
/**
 * Illustration templates. The key is the "Plantilla" id set in the product's template-studio block.
 * - reference: the template image Replicate copies the style from (second image; first with refFirst).
 * - refFirst: the model edits the template and swaps in the customer's pet (keeps pose and style better).
 * - prompt: what to do with the customer's photo (first image). {NAME} is replaced with the name.
 * Prompts are fixed here on purpose: customers can't send their own prompts.
 */
const TEMPLATES = {
  'retrato-nombre': {
    needsName: true,
    font: 'moderna',
    colors: { crema: 'warm off-white', rosa: 'soft pastel pink', azul: 'pale powder blue', verde: 'soft sage green', arena: 'warm sand beige' },
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new portrait painting of the pet from the first image in exactly the same style as the second image: ' +
      'thick impasto oil paint with visible palette-knife and brush strokes, plain {COLOR} background, ' +
      'the animal facing forward and centred, framed from the chest up, happy expression. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. No clothes or accessories. ' +
      'Write the name "{NAME}" small in {FONT}, in black, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'retrato-sudadera': {
    needsName: true,
    font: 'pincel',
    colors: { rosa: 'pink', azul: 'blue', verde: 'sage green', amarillo: 'butter yellow', lila: 'lilac' },
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-retrato-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new portrait illustration of the pet from the first image in exactly the same style as the second image: ' +
      'flat hand-painted illustration with soft brush texture, plain pastel {COLOR} background, the animal facing forward, ' +
      'happy expression, wearing a {COLOR} hoodie in a slightly deeper shade than the background, with white drawstrings, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'Write the name "{NAME}" large, in {FONT}, in white, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'oleo-vintage': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-oleo.jpg',
    prompt:
      'The first image is the finished artwork template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same vintage oil painting look with visible textured brushstrokes on every part, the same vertical pale blue and cream striped background, ' +
      'the same cream headscarf with small blue flowers tied under the chin, the same pose, head tilt, angle, size and chest-up framing. ' +
      'The pet must be fully repainted in oil brushstrokes like the rest of the painting: never keep photographic pixels, photo fur texture, photo lighting or anything of the photo background (bed, sheets, room). Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },

  'en-su-rincon': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-en-casa.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new painting of the pet from the first image in exactly the same style as the second image: ' +
      'textured painterly brushwork, the pet lying relaxed on a soft pale blue sofa with its head resting on a blue cushion, ' +
      'plain warm off-white wall behind, calm cosy mood, looking at the viewer. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'ilustracion-plana': {
    needsName: false,
    colors: { gris: 'light grey', rosa: 'soft pastel pink', azul: 'pale powder blue', verde: 'soft sage green', amarillo: 'soft butter yellow' },
    aspectRatio: '3:4',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-plana.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same clean flat vector style with crisp cel-shaded fur in a few flat tones, smooth shapes and fine whisker lines, the same thin white sticker outline around the animal, ' +
      'the same close-up portrait framing as the template: only the head and the top of the chest, the head large and filling the upper two thirds of the picture, cropped at the chest. No legs, no paws, no full body. ' +
      'The head faces the viewer, looking at the viewer, like the template animal. Background: plain flat {COLOR}. ' +
      'Do not copy the pose, lying position, framing or angle of the photo. ' +
      'The pet must be fully redrawn as flat vector shapes: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head and two ears. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 3:4.'
  },

  'navidad-verde': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-navidad-verde.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same painterly digital illustration style, the same lime-green shaggy furry hood with a long tuft on top around the head, the same lime-green shaggy furry collar covering the shoulders and chest, ' +
      'the same red satin bow under the chin, the same flat pale sky-blue background with round white snow dots, the same pose, angle, size and head-and-chest framing. ' +
      'The pet\'s ears stick out of the hood like in the template if it has them. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'navidad-papa-noel': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-navidad-papa-noel.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same clean digital illustration style with soft painted fur, the same red Santa hat with white fluffy trim and pompom worn tilted on the head, ' +
      'the same red and white striped candy cane held sideways in the mouth, the same flat pale sky-blue background with round white snow dots, the same pose, angle, size and head-and-chest framing, looking at the viewer. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'retrato-glam': {
    needsName: true,
    font: 'manuscrita', /* keeps the name as typed («Thor», not «THOR») on the tag */
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-glam.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same flat hand-painted illustration style with soft paper texture, the same plain pastel pink background, ' +
      'the same pink cat-eye sunglasses with tinted pink lenses and little star details, worn on the pet\'s face over the eyes and tilted like in the template, ' +
      'the same pink leather collar with a silver buckle and a red heart-shaped tag hanging from it, the same pose, angle, size and head-and-chest framing, happy expression. ' +
      'The heart tag shows the name "{NAME}" in white, spelled exactly, with a small white star under it. No other text. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No logos, no border. Vertical 4:5.'
  },
  'retrato-comic': {
    needsName: true,
    font: 'manuscrita',
    colors: { azul: 'bright blue', rojo: 'bright red', rosa: 'hot pink', verde: 'green', negro: 'black', morado: 'purple' },
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-comic.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same cheerful hand-drawn comic illustration style with fine ink outlines and textured colour, the same plain mustard yellow background with the same little white stars, dots and motion lines, ' +
      'the same tilted head leaning into the picture from the left, the same big happy open-mouth smile with the tongue out, looking at the viewer, the same framing. ' +
      'The collar is {COLOR} leather with stitching and a gold ring, with a red heart-shaped tag hanging from it. ' +
      'The heart tag shows the name "{NAME}" in white, spelled exactly, with a small white star under it. No other text. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No logos, no border. Vertical 4:5.'
  },
  'momento-ilustrado': {
    needsName: false,
    font: 'manuscrita',
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-momento-ilustrado.jpg',
    textPrompt: 'Add the text "{NAME}" in {FONT}, dark charcoal, small and centred at the bottom on the white background, spelled exactly. ',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its people, faces, clothes or objects. ' +
      'Repaint the first image as a new warm editorial illustration in exactly the same style as the second image: ' +
      'soft flat colour shapes with a fine dry-brush and paper grain texture, gentle shading, rosy cheeks, simplified but expressive faces, ' +
      'no background scene: the people and the main objects of the photo float on a plain warm off-white background, with a loose painted brush stroke under them as a base. ' +
      'Keep every person and pet from the first image, with their faces, hair, expressions, clothes and poses recognisable, and keep meaningful objects (a cake, flowers, a gift). ' +
      'It must be a completely new hand-made illustration: never keep or paste photographic pixels. Do not add or remove people. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'acuarela-familia': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-acuarela-familia.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Repaint the first image as a watercolour illustration in exactly the same style as the second image: ' +
      'soft watercolour on textured white paper, warm cosy light, gentle outlines, irregular painted edges fading into the white paper. ' +
      'Keep every person and pet from the first image, their faces, hair, clothes, poses and the setting, recognisable. ' +
      'Do not add or remove people. No text, no logos, no border. Vertical 4:5.'
  }
};

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
 *   GET  /send           { enabled } — the theme shows «Envíamela» only when sending is set up
 *   POST /send           { id, email, name?, template?, page } -> { ok }  the illustration by email (Brevo)
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
 *   BREVO_API_KEY         secret: sends «Envíamela» emails (free plan, 300/day)
 *   SENDER_EMAIL          verified Brevo sender, default hola@arsnoir.com
 */

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
const statsPage = async (kv, showImages) => {
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
      if (what === 'mail') r.mail = (r.mail || 0) + n;
      if (what === 'fail') r.fail = (r.fail || 0) + n;
    }
    cursor = list.list_complete ? null : list.cursor;
  } while (cursor);
  const list = Object.values(rows).sort((a, b) => (b.day + b.tpl).localeCompare(a.day + a.tpl));
  const days = {};
  list.forEach((r) => { const d = (days[r.day] = days[r.day] || { made: 0, cart: 0, fail: 0 }); d.made += r.made; d.cart += r.cart; d.fail += r.fail || 0; });
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const tr = (cells, tag = 'td') => '<tr>' + cells.map((c) => '<' + tag + '>' + esc(c) + '</' + tag + '>').join('') + '</tr>';
  const html = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>ARSNOIR · contador</title><style>body{font:15px system-ui,sans-serif;margin:24px;color:#0a0a0a;background:#f4f4f3}' +
    'h1{font-size:20px}h2{font-size:16px;margin-top:28px}table{border-collapse:collapse;width:100%;max-width:640px;background:#fff}' +
    'td,th{padding:8px 10px;border-bottom:1px solid #e2e2e0;text-align:left}th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#6b6b6b}</style>' +
    '<h1>Ilustraciones generadas</h1><p>Hoy (' + today() + '): <b>' + ((days[today()] || {}).made || 0) + '</b> intentos · <b>' + ((days[today()] || {}).fail || 0) + '</b> fallidos · <b>' + ((days[today()] || {}).cart || 0) + '</b> al carrito</p>' +
    '<h2>Por día</h2><table>' + tr(['Día', 'Intentos', 'Fallidos', 'Al carrito'], 'th') +
    Object.keys(days).sort().reverse().map((d) => tr([d, days[d].made, days[d].fail, days[d].cart])).join('') + '</table>' +
    '<h2>Por plantilla</h2><table>' + tr(['Día', 'Plantilla', 'Generadas', 'Al carrito'], 'th') +
    list.filter((r) => r.tpl !== '-' || r.cart).map((r) => tr([r.day, r.tpl, r.made, r.cart])).join('') + '</table>' + (await gallery(kv, showImages));
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
};

/* Last illustrations made (only with ?k=STATS_KEY): to check the AI did a good job. Copies last 7 days. */
const gallery = async (kv, showImages) => {
  if (!showImages) return '<p style="margin-top:28px;color:#6b6b6b">Para ver las ilustraciones, añade el secreto STATS_KEY en Cloudflare y abre esta página con ?k=TU_CLAVE</p>';
  const list = await kv.list({ prefix: 'g:', limit: 40 });
  if (!list.keys.length) return '<h2>Últimas ilustraciones</h2><p>Todavía ninguna.</p>';
  const cards = list.keys.map((k) => {
    const [, inv, id] = k.name.split(':');
    const when = new Date(9e15 - Number(inv)).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    return '<a href="/img/' + id + '.png" target="_blank" style="display:block;text-decoration:none;color:#6b6b6b;font-size:12px"><img src="/img/' + id + '.png" loading="lazy" style="width:100%;aspect-ratio:4/5;object-fit:cover;background:#e2e2e0;display:block">' + when + '</a>';
  }).join('');
  return '<h2>Últimas ilustraciones (7 días)</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;max-width:900px">' + cards + '</div>';
};

/* «Envíamela»: the customer's illustration by email, with a button back to the product */
const mailHtml = (img, name, page) => {
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const who = name ? esc(name) : 'tu mascota';
  return '<!doctype html><html lang="es"><body style="margin:0;background:#f4f4f3;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">' +
    '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff">' +
    '<tr><td style="padding:28px 28px 8px;text-align:center;font-size:13px;letter-spacing:.3em">A R S N O I R</td></tr>' +
    '<tr><td style="padding:8px 28px 18px;text-align:center"><h1 style="margin:0;font-size:26px;line-height:1.2">Así queda ' + who + ' 🐾</h1>' +
    '<p style="margin:10px 0 0;color:#6b6b6b;font-size:15px">Aquí tienes la ilustración que has creado. Guárdala, enséñala… y cuando quieras, la imprimimos para tu pared.</p></td></tr>' +
    '<tr><td style="padding:0 28px"><img src="' + esc(img) + '" width="504" alt="Ilustración de ' + who + '" style="display:block;width:100%;height:auto;border:10px solid #141414"></td></tr>' +
    '<tr><td style="padding:24px 28px 8px;text-align:center"><a href="' + esc(page) + '?utm_source=email&utm_medium=envio-ilustracion" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-weight:bold;padding:15px 28px;border-radius:999px;font-size:14px;letter-spacing:.06em">LO QUIERO EN MI PARED</a></td></tr>' +
    '<tr><td style="padding:8px 28px 28px;text-align:center;color:#6b6b6b;font-size:13px">Lienzo o póster, con o sin marco. Desde 24,95 € · Envío a España y UE.<br>¿Dudas? Responde a este email.</td></tr>' +
    '</table><p style="color:#9a9a98;font-size:11px;margin:16px 0 0">Recibes este email porque pediste tu ilustración en arsnoir.com.</p></td></tr></table></body></html>';
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
      return statsPage(kv, !!env.STATS_KEY && url.searchParams.get('k') === env.STATS_KEY);
    }

    if (url.pathname === '/send' && request.method === 'GET') {
      return json({ enabled: !!(env.BREVO_API_KEY && env.KEEP) });
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
      // Retries after a failed run (the theme sends attempt 1 or 2): change the request a little,
      // since the same input often fails again the same way
      const retry = Math.min(2, Math.max(0, parseInt(body.attempt, 10) || 0));
      if (retry) prompt += ' Keep it a warm, friendly, family-safe illustration of the pet only; leave out any people, logos or text other than the name.';
      if (!tpl.needsName && name && tpl.textPrompt) prompt += ' ' + fill(tpl.textPrompt);
      const model = env.MODEL || 'google/nano-banana';
      const res = await replicate('/models/' + model + '/predictions', {
        method: 'POST',
        body: JSON.stringify({ input: { prompt, image_input: (retry === 2 ? !tpl.refFirst : tpl.refFirst) ? [tpl.reference, image] : [image, tpl.reference], output_format: 'png', aspect_ratio: tpl.aspectRatio || '4:5' } })
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
      if (data.status === 'failed') {
        // Counted once per run (the theme polls until it sees «failed»)
        const fk = 'f:' + m[1];
        const kv = env.KEEP || env.LIMITS;
        if (kv && !(await kv.get(fk))) { await kv.put(fk, '1', { expirationTtl: 3 * 24 * 3600 }); await count(kv, 'fail', '-'); }
      }
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
            if (file.ok) {
              await env.KEEP.put(key, await file.arrayBuffer(), { expirationTtl: 7 * 24 * 3600 });
              saved = url.origin + '/img/' + key;
              // Owner's check list (stats page with the key): newest first, kept as long as the copy
              await env.KEEP.put('g:' + (9e15 - Date.now()) + ':' + m[1], '', { expirationTtl: 7 * 24 * 3600 });
            }
          }
        } catch (e) { saved = ''; }
      }
      return json({ status: 'succeeded', url: out, saved, temporary: true, keep: !!env.KEEP });
    }

    // «Envíamela»: send the customer their illustration (and keep that copy for good, the email links to it)
    if (request.method === 'POST' && url.pathname === '/send') {
      if (!env.BREVO_API_KEY || !env.KEEP) return json({ error: 'not_configured' }, 503);
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
      const id = String(body.id || '');
      const email = String(body.email || '').trim().slice(0, 120);
      if (!/^[a-z0-9]{8,64}$/i.test(id)) return json({ error: 'id' }, 400);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'email' }, 400);
      let page = String(body.page || '');
      if (!allowed.some((o) => page.startsWith(o + '/'))) page = allowed[0] || '';
      const name = String(body.name || '').replace(/[^\p{L}\p{N} '\-&.!]/gu, '').trim().slice(0, 24);
      // At most 5 emails per visitor per day
      const lim = env.LIMITS || env.KEEP;
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const lkey = 'm:' + new Date().toISOString().slice(0, 10) + ':' + ip;
      const sent = parseInt((await lim.get(lkey)) || '0', 10);
      if (sent >= 5) return json({ error: 'limit' }, 429);
      const copy = await env.KEEP.get(id + '.png', { type: 'arrayBuffer' });
      if (!copy) return json({ error: 'expired' }, 410);
      await env.KEEP.put(id + '.png', copy);
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          sender: { name: 'ARSNOIR', email: env.SENDER_EMAIL || 'hola@arsnoir.com' },
          to: [{ email }],
          subject: name ? 'Así queda ' + name + ' 🐾 Tu ilustración de ARSNOIR' : 'Tu ilustración de ARSNOIR 🐾',
          htmlContent: mailHtml(url.origin + '/img/' + id + '.png', name, page),
          tags: ['ilustracion', String(body.template || '').slice(0, 40)].filter(Boolean)
        })
      });
      if (!res.ok) return json({ error: 'send' }, 502);
      await lim.put(lkey, String(sent + 1), { expirationTtl: 60 * 60 * 26 });
      await count(env.KEEP || env.LIMITS, 'mail', TEMPLATES[body.template] ? body.template : '-');
      return json({ ok: true });
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
