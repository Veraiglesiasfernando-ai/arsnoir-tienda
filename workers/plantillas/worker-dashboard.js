// Single-file build for pasting in the Cloudflare dashboard (generated from worker.js + templates.js).
/**
 * Illustration templates. The key is the "Plantilla" id set in the product's template-studio block.
 * - reference: the template image Replicate copies the style from (second image).
 * - prompt: what to do with the customer's photo (first image). {NAME} is replaced with the name.
 * Prompts are fixed here on purpose: customers can't send their own prompts.
 */
const TEMPLATES = {
  'retrato-nombre': {
    needsName: true,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new portrait painting of the pet from the first image in exactly the same style as the second image: ' +
      'thick impasto oil paint with visible palette-knife and brush strokes, plain warm off-white background, ' +
      'the animal facing forward and centred, framed from the chest up, happy expression. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. No clothes or accessories. ' +
      'Write the name "{NAME}" small in clean black sans-serif capital letters with wide letter spacing, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'retrato-sudadera': {
    needsName: true,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-retrato-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new portrait illustration of the pet from the first image in exactly the same style as the second image: ' +
      'flat hand-painted illustration with soft brush texture, plain pastel pink background, the animal facing forward, ' +
      'happy expression, wearing a pink hoodie with white drawstrings, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'Write the name "{NAME}" in large white hand-painted brush capital letters centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'oleo-vintage': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-oleo.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new vintage oil painting of the pet from the first image in exactly the same style as the second image: ' +
      'fine textured oil brushwork, background of vertical pale blue and cream stripes, ' +
      'the pet wearing a cream headscarf with small blue flowers tied under the chin, head slightly tilted, sweet expression, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'en-su-rincon': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-en-casa.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new painting of the pet from the first image in exactly the same style as the second image: ' +
      'textured painterly brushwork, the pet lying relaxed on a soft pale blue sofa with its head resting on a blue cushion, ' +
      'plain warm off-white wall behind, calm cosy mood, looking at the viewer. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'ilustracion-plana': {
    needsName: false,
    aspectRatio: '3:4',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-plana.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new portrait of the pet from the first image in exactly the same style as the second image: ' +
      'clean flat vector illustration with crisp cel-shaded fur in a few flat tones, smooth shapes, fine whisker lines, ' +
      'a thin white sticker outline around the animal, plain flat light grey background, head and chest framed close, looking at the viewer. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 3:4.'
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
 * When a preview succeeds and an R2 bucket is bound (PREVIEWS), the image is copied there so
 * the link saved in the order never expires (Replicate's own links expire after about an hour).
 *
 * Secrets / vars (set them in Cloudflare, never in the theme):
 *   REPLICATE_API_TOKEN   secret
 *   ALLOWED_ORIGINS       comma-separated store origins, e.g. https://arsnoir.com,https://xxxx.myshopify.com
 *   MODEL                 Replicate model, default google/nano-banana
 *   PUBLIC_BASE           public URL of the R2 bucket, e.g. https://plantillas.arsnoir.com
 *   DAILY_LIMIT           previews per visitor per day, default 6 (needs the LIMITS KV binding)
 */

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

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
    if (!allowed.includes(origin)) return json({ error: 'origin' }, 403);
    if (!env.REPLICATE_API_TOKEN) return json({ error: 'not_configured' }, 503);

    const url = new URL(request.url);
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
      const name = String(body.name || '').replace(/[^\p{L}\p{N} '\-&.]/gu, '').trim().slice(0, 16);
      if (tpl.needsName && !name) return json({ error: 'name' }, 400);

      // Per-visitor daily limit (optional KV binding LIMITS)
      if (env.LIMITS) {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const key = 'n:' + new Date().toISOString().slice(0, 10) + ':' + ip;
        const used = parseInt((await env.LIMITS.get(key)) || '0', 10);
        if (used >= parseInt(env.DAILY_LIMIT || '6', 10)) return json({ error: 'limit' }, 429);
        await env.LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });
      }

      const prompt = tpl.prompt.replace('{NAME}', name.toUpperCase());
      const model = env.MODEL || 'google/nano-banana';
      const res = await replicate('/models/' + model + '/predictions', {
        method: 'POST',
        body: JSON.stringify({ input: { prompt, image_input: [image, tpl.reference], output_format: 'png', aspect_ratio: tpl.aspectRatio || '4:5' } })
      });
      const data = await res.json();
      if (!res.ok || !data.id) return json({ error: 'replicate', detail: data.detail || null }, 502);
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
      return json({ status: 'succeeded', url: out, temporary: true });
    }

    return json({ error: 'not_found' }, 404);
  }
};
