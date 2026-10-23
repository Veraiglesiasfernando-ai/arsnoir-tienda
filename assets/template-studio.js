/* Personalízalo · template editor (snippets/template-studio.liquid).
   Photo (+ name) -> ARSNOIR worker -> Replicate -> preview. The preview link goes into the order;
   until there is one, the buy buttons of this product don't add to the cart. */
(function () {
  const studio = document.querySelector('[data-tstudio]');
  if (!studio || studio.dataset.ready) return;
  studio.dataset.ready = '1';
  const d = studio.dataset;
  const form = (studio.querySelector('[data-tstudio-url]') || {}).form ||
    document.querySelector('form[data-ajax-cart]');
  const endpoint = (d.endpoint || '').replace(/\/$/, '');
  const urlInput = studio.querySelector('[data-tstudio-url]');
  const status = studio.querySelector('[data-tstudio-status]');
  const say = function (t) { if (status) status.textContent = t || ''; };

  /* Replicate's links expire in about an hour: when the work goes to the cart, the worker keeps a
     copy for good (/keep) and the order gets that link. keepId = the preview still to be kept. */
  let keepId = '';
  /* Without a preview the product can't go to the cart (also covers the sticky buy bar) */
  document.addEventListener('submit', function (event) {
    if (event.target !== form) return;
    if (!endpoint || !urlInput || !urlInput.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      say(d.tMissing);
      studio.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!keepId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const id = keepId;
    const submitter = event.submitter;
    keepId = '';
    if (submitter) submitter.disabled = true;
    /* Up to 3 tries; if all fail, the order still has the 7-day copy (or Replicate's link) */
    const keep = function (n) {
      return fetch(endpoint + '/keep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) })
        .then(function (r) { return r.ok ? r.json() : null; }, function () { return null; })
        .then(function (res) {
          if (res && res.url) { urlInput.value = res.url; return; }
          if (n < 2) return new Promise(function (r) { setTimeout(r, 1200); }).then(function () { return keep(n + 1); });
        });
    };
    keep(0)
      .catch(function () {})
      .finally(function () {
        /* Next task: a form ignores a new submit while it is still firing the previous one */
        setTimeout(function () {
          if (submitter) submitter.disabled = false;
          if (form.requestSubmit) form.requestSubmit(submitter && submitter.form === form ? submitter : undefined);
          else form.submit();
        }, 0);
      });
  }, true);
  if (!endpoint) return;

  const fileInput = studio.querySelector('[data-tstudio-file]');
  const thumb = studio.querySelector('[data-tstudio-thumb]');
  const dropText = studio.querySelector('[data-tstudio-drop-text]');
  const nameInput = studio.querySelector('[data-tstudio-name]');
  const nameProp = studio.querySelector('[data-tstudio-name-prop]');
  const go = studio.querySelector('[data-tstudio-go]');
  const result = studio.querySelector('[data-tstudio-result]');
  const resultImg = studio.querySelector('[data-tstudio-img]');
  const max = parseInt(d.max, 10) || 3;
  const needsName = d.needsName === 'true';
  const fontProp = studio.querySelector('[data-tstudio-font-prop]');
  const colorProp = studio.querySelector('[data-tstudio-color-prop]');
  const picked = function (attr) { const el = studio.querySelector('[' + attr + ']:checked'); return el || null; };
  /* A sangre / con borde blanco: same illustration, only the margin changes (preview + order) */
  const borderProp = studio.querySelector('[data-tstudio-border-prop]');
  const applyBorder = function () {
    const el = picked('data-tstudio-border');
    const white = !!(el && el.dataset.white === 'true');
    if (borderProp && el) borderProp.value = el.value;
    studio.classList.toggle('is-bordered', white);
    document.querySelectorAll('.tlive').forEach(function (t) { t.classList.toggle('is-bordered', white); });
  };
  studio.querySelectorAll('[data-tstudio-border]').forEach(function (el) { el.addEventListener('change', function () { applyBorder(); paintRooms(); }); });
  let photo = null;

  const used = function () {
    try { return parseInt(localStorage.getItem(d.key) || '0', 10); } catch (e) { return 0; }
  };
  const addUse = function () {
    try { localStorage.setItem(d.key, String(used() + 1)); } catch (e) {}
  };
  /* The illustration on a wall, first in the gallery: follows the chosen size and finish */
  const gallery = document.querySelector('.product__gallery');
  let live = null;
  const sizeOf = function (text) {
    const m = String(text || '').replace(/,/g, '.').match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/);
    return m ? [parseFloat(m[1]), parseFloat(m[2])] : [21, 29.7];
  };
  /* Every framed picture in the gallery (examples + the customer's illustration) follows size and finish */
  const syncLive = function () {
    if (!gallery) return;
    const sizeIn = document.querySelector('fieldset[data-option-kind="size"] input:checked');
    const finIn = document.querySelector('fieldset[data-option-kind="frame"] input:checked');
    const sizeText = sizeIn ? (sizeIn.dataset.display || sizeIn.value) : '';
    const finText = finIn ? (finIn.dataset.display || finIn.value) : '';
    const f = finText.toLowerCase();
    let kind = 'none';
    if (/negr|black/.test(f)) kind = 'black';
    else if (/blanc|white/.test(f)) kind = 'white';
    else if (/madera|wood|natural/.test(f)) kind = 'wood';
    const s = sizeOf(sizeText);
    const w = Math.min(s[0], s[1]), h = Math.max(s[0], s[1]);
    /* The illustration is the star: always drawn big (the room photos and the size guide show the scale) */
    const fw = kind === 'none' ? 0 : 2.5;
    const fwW = w + fw * 2, fwH = h + fw * 2;
    const share = Math.min(0.8, (0.86 * 1.25 * fwW) / fwH); /* of the 4:5 wall's width */
    const cap = [sizeText, finText].filter(Boolean).join(' · ');
    gallery.querySelectorAll('.tlive:not([hidden])').forEach(function (el) {
      const wall = el.querySelector('.tlive__wall');
      const frame = el.querySelector('.tlive__frame');
      const px = ((wall.clientWidth || 600) * share) / fwW;
      frame.dataset.kind = kind;
      frame.classList.toggle('is-canvas', /lienzo|canvas/.test(f));
      frame.style.width = share * 100 + '%';
      frame.style.aspectRatio = fwW + ' / ' + fwH;
      frame.style.borderWidth = fw ? Math.max(1, fw * px) + 'px' : '0';
      const c = el.querySelector('.tlive__cap');
      if (c) c.textContent = el === live ? cap : '';
    });
  };
  const ensureLive = function () {
    if (!gallery) return null;
    if (!live) {
      live = document.createElement('div');
      live.className = 'product__media tlive';
      live.innerHTML = '<div class="tlive__wall">' +
        '<div class="tlive__frame"><img class="tlive__art" alt="" width="720" height="900">' +
        '<img class="tload__sketch" alt="" aria-hidden="true"><img class="tload__color" alt="" aria-hidden="true"></div>' +
        '<figure class="tload__photo" aria-hidden="true"><img alt=""><figcaption>' + (d.tPhoto || 'Tu foto') + '</figcaption></figure>' +
        '<div class="tload" aria-hidden="true"><p class="tload__step"></p><div class="tload__bar"><span></span></div></div>' +
        '</div><p class="tlive__cap"></p>';
      gallery.insertBefore(live, gallery.firstChild);
    }
    return live;
  };
  /* While the illustration is made: the customer's photo pinned like a polaroid next to the frame,
     and the style's example being painted inside it (pencil sketch → colour, brush pass on a loop),
     with the step and a thin progress line underneath */
  const STEPS = (d.steps || '').split('|').map(function (t) { return t.trim(); }).filter(Boolean);
  let stepTimer = null;
  const startLoading = function () {
    const el = ensureLive();
    let i = 0;
    const step = function () {
      const t = STEPS.length ? STEPS[Math.min(i, STEPS.length - 1)] + '…' : d.tWorking;
      say(t);
      if (el) el.querySelector('.tload__step').textContent = t;
      i++;
    };
    step();
    stepTimer = setInterval(step, 7000);
    if (!el || !photo) return;
    const example = d.example || photo;
    el.querySelector('.tload__sketch').src = example;
    el.querySelector('.tload__color').src = example;
    el.querySelector('.tload__photo img').src = photo;
    el.hidden = false;
    el.classList.remove('is-loading');
    void el.offsetWidth; /* restart the animations */
    el.classList.add('is-loading');
    syncLive();
    gallery.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const stopLoading = function () {
    clearInterval(stepTimer);
    if (live) live.classList.remove('is-loading');
  };
  /* The room photos show the template's example: once there is an illustration, paint it into
     their frame (same spot in every product, measured on the photos) and hide the example-only ones */
  const ROOMS = { 'salón': [41.72, 24, 29.22, 29.73], 'dormitorio': [37.75, 16.93, 24.83, 28.93], 'estudio': [34.77, 13.2, 36.26, 37.47] };
  let artUrl = '';
  const roomOf = function (img) {
    const m = (img.alt || '').match(/ en un (salón|dormitorio|estudio)$/i);
    return m ? ROOMS[m[1].toLowerCase()] : null;
  };
  const exampleOnly = function (img) {
    const a = img.alt || '';
    return img.hasAttribute('data-black') || / con marco negro$|, la obra$|^Ejemplo:|^La foto original/i.test(a);
  };
  const paintRooms = function () {
    if (!gallery) return;
    const white = studio.classList.contains('is-bordered');
    gallery.querySelectorAll('.product__media:not(.tlive) > img').forEach(function (img) {
      const media = img.parentElement;
      if (!artUrl) { media.hidden = false; img.hidden = false; const old = media.querySelector('canvas.tart'); if (old) old.remove(); return; }
      if (exampleOnly(img)) { media.hidden = true; return; }
      const r = roomOf(img);
      if (!r) return;
      const art = new Image();
      const draw = function () {
        if (!img.naturalWidth || !art.naturalWidth) return;
        let c = media.querySelector('canvas.tart');
        if (!c) { c = document.createElement('canvas'); c.className = 'tart'; c.setAttribute('role', 'img'); media.appendChild(c); }
        c.setAttribute('aria-label', img.alt);
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, c.width, c.height);
        let x = r[0] / 100 * c.width, y = r[1] / 100 * c.height, w = r[2] / 100 * c.width, h = r[3] / 100 * c.height;
        if (white) {
          g.fillStyle = '#fbfbfa'; g.fillRect(x, y, w, h);
          const m = Math.min(w, h) * 0.065; x += m; y += m; w -= m * 2; h -= m * 2;
        }
        const k = Math.max(w / art.naturalWidth, h / art.naturalHeight);
        const sw = w / k, sh = h / k;
        g.drawImage(art, (art.naturalWidth - sw) / 2, (art.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
        /* a little depth: the frame's shadow on the top and left edges */
        const sh1 = g.createLinearGradient(0, y, 0, y + h * 0.05);
        sh1.addColorStop(0, 'rgba(0,0,0,0.22)'); sh1.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = sh1; g.fillRect(x, y, w, h * 0.05);
        const sh2 = g.createLinearGradient(x, 0, x + w * 0.04, 0);
        sh2.addColorStop(0, 'rgba(0,0,0,0.15)'); sh2.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = sh2; g.fillRect(x, y, w * 0.04, h);
        img.hidden = true;
      };
      img.loading = 'eager';
      if (!img.complete) img.addEventListener('load', draw, { once: true });
      art.onload = draw;
      art.src = artUrl;
    });
  };
  const showLive = function (url) {
    artUrl = url;
    paintRooms();
    if (!ensureLive()) return;
    const img = live.querySelector('.tlive__art');
    img.alt = resultImg.alt;
    img.src = url;
    live.hidden = false;
    applyBorder();
    /* «Verlo en mi pared» shows the customer's illustration (falls back to the example if it can't load it) */
    document.querySelectorAll('size-compare').forEach(function (el) { el.dataset.art = url; });
    syncLive();
    gallery.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };
  document.addEventListener('change', function (event) {
    if (event.target.closest && event.target.closest('variant-picker')) requestAnimationFrame(syncLive);
  });
  window.addEventListener('resize', syncLive);
  syncLive();

  /* A new photo or name invalidates the previous preview */
  const reset = function () {
    keepId = '';
    urlInput.value = '';
    if (nameProp) nameProp.value = '';
    if (fontProp) fontProp.value = '';
    if (colorProp) colorProp.value = '';
    result.hidden = true;
    if (live) live.hidden = true;
    artUrl = '';
    paintRooms();
  };
  const ready = function () {
    go.disabled = !photo || (needsName && !nameInput.value.trim()) || used() >= max;
  };

  /* Resize to max 1536 px and send as JPEG: enough detail for the model, small upload */
  fileInput.addEventListener('change', function () {
    const file = fileInput.files && fileInput.files[0];
    photo = null;
    reset();
    if (!file) return ready();
    const img = new Image();
    img.onload = function () {
      const k = Math.min(1, 1536 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      photo = c.toDataURL('image/jpeg', 0.9);
      thumb.src = photo;
      thumb.hidden = false;
      if (dropText) dropText.hidden = true;
      URL.revokeObjectURL(img.src);
      ready();
    };
    img.onerror = function () { say(d.tError); };
    img.src = URL.createObjectURL(file);
  });
  if (nameInput) nameInput.addEventListener('input', function () { reset(); ready(); });
  /* A different letter or colour needs a new preview */
  studio.querySelectorAll('[data-tstudio-font], [data-tstudio-color]').forEach(function (el) {
    el.addEventListener('change', function () { reset(); ready(); });
  });

  const wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* A dropped connection for a moment is not a failure: keep asking (about 3 minutes in all) */
  const poll = function (id, tries) {
    if (tries > 70) return Promise.reject(new Error('failed'));
    return fetch(endpoint + '/preview/' + encodeURIComponent(id))
      .then(function (r) { return r.json(); }, function () { return { status: 'retry' }; })
      .then(function (res) {
        if (res.status === 'succeeded' && res.url) return res;
        if (res.status === 'failed' || res.status === 'canceled') throw new Error('failed');
        return wait(2500).then(function () { return poll(id, tries + 1); });
      });
  };
  /* Start the preview. When Replicate is busy (throttled) or the connection drops, try again
     a few times before showing an error; the daily limit (429 «limit») stops at once. */
  const start = function (payload, tries) {
    return fetch(endpoint + '/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, status: r.status, body: b }; }); },
        function () { return { ok: false, status: 0, body: {} }; })
      .then(function (res) {
        if (res.ok && res.body.id) return res.body.id;
        if (res.status === 429 && res.body.error === 'limit') throw new Error('limit');
        const busy = res.status === 0 || res.status === 429 || res.status >= 500;
        if (busy && tries < 6) {
          if (tries > 0 && d.tBusy) say(d.tBusy);
          return wait(tries === 0 ? 3000 : 10000).then(function () { return start(payload, tries + 1); });
        }
        throw new Error(res.status === 400 && res.body.error === 'image' ? 'image' : 'failed');
      });
  };

  go.addEventListener('click', function () {
    if (go.disabled) return;
    go.disabled = true;
    go.classList.add('is-loading');
    startLoading();
    const name = nameInput ? nameInput.value.trim() : '';
    const payload = JSON.stringify({
      template: d.template, name: name, image: photo,
      font: picked('data-tstudio-font') ? picked('data-tstudio-font').value : '',
      color: picked('data-tstudio-color') ? picked('data-tstudio-color').value : ''
    });
    /* The model sometimes returns a failed run: make a second one by itself before showing an error */
    const attempt = function (n) {
      return start(payload, 0)
        .then(function (id) {
          return poll(id, 0).then(function (done) { return { url: done.url, saved: done.saved || '', keep: done.temporary && done.keep ? id : '' }; });
        })
        .catch(function (err) { return err && err.message === 'failed' && n < 1 ? attempt(n + 1) : Promise.reject(err); });
    };
    attempt(0)
      .then(function (out) {
        const url = out.url;
        keepId = out.keep;
        /* Only a preview that worked counts towards the customer's limit */
        addUse();
        stopLoading();
        /* The order gets the copy kept by the worker; the screen shows the image as it came */
        urlInput.value = out.saved || url;
        if (nameProp) nameProp.value = name;
        const f = picked('data-tstudio-font'), c = picked('data-tstudio-color');
        if (fontProp) fontProp.value = name && f ? f.nextElementSibling.textContent : '';
        if (colorProp) colorProp.value = c ? c.dataset.label : '';
        resultImg.src = url;
        result.hidden = false;
        showLive(url);
        const left = max - used();
        say(left > 0 ? (d.tLeft || '').replace('[N]', left) : '');
      })
      .catch(function (err) {
        stopLoading();
        if (live && !urlInput.value) live.hidden = true;
        say(err && err.message === 'limit' ? d.tLimit : (err && err.message === 'image' && d.tImage ? d.tImage : d.tError));
      })
      .finally(function () { go.classList.remove('is-loading'); ready(); });
  });

  /* Preview chosen in «Pruébala en todos los estilos» (pz-all-styles.js): use it as this one's */
  try {
    const hand = JSON.parse(sessionStorage.getItem('arsnoir-pz-handoff') || 'null');
    if (hand && hand.template === d.template && hand.url && Date.now() - hand.at < 50 * 60 * 1000) {
      sessionStorage.removeItem('arsnoir-pz-handoff');
      urlInput.value = hand.saved || hand.url;
      keepId = hand.keep || '';
      if (nameInput && hand.name) nameInput.value = hand.name;
      if (nameProp) nameProp.value = hand.name || '';
      const hf = picked('data-tstudio-font'), hc = picked('data-tstudio-color');
      if (fontProp) fontProp.value = hand.name && hf ? hf.nextElementSibling.textContent : '';
      if (colorProp) colorProp.value = hc ? hc.dataset.label : '';
      resultImg.src = hand.url;
      result.hidden = false;
      showLive(hand.url);
    }
  } catch (e) {}

  if (used() >= max) say(d.tLimit);
  ready();
})();
