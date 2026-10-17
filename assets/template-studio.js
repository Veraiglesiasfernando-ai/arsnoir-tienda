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

  /* Without a preview the product can't go to the cart (also covers the sticky buy bar) */
  document.addEventListener('submit', function (event) {
    if (event.target !== form) return;
    if (!endpoint || !urlInput || !urlInput.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      say(d.tMissing);
      studio.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
  studio.querySelectorAll('[data-tstudio-border]').forEach(function (el) { el.addEventListener('change', applyBorder); });
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
    /* ~75 cm across, like the framed photo of the artworks: sizes still read bigger or smaller */
    const WALL = 75;
    const fw = kind === 'none' ? 0 : 2.5;
    const fwW = w + fw * 2, fwH = h + fw * 2;
    const fit = Math.min(1, (0.78 * WALL) / fwW, (0.78 * WALL * 1.25) / fwH); /* 4:5 */
    const cap = [sizeText, finText].filter(Boolean).join(' · ');
    gallery.querySelectorAll('.tlive:not([hidden])').forEach(function (el) {
      const wall = el.querySelector('.tlive__wall');
      const frame = el.querySelector('.tlive__frame');
      const px = ((wall.clientWidth || 600) / WALL) * fit;
      frame.dataset.kind = kind;
      frame.classList.toggle('is-canvas', /lienzo|canvas/.test(f));
      frame.style.width = (fwW / WALL) * fit * 100 + '%';
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
      live.innerHTML = '<div class="tlive__wall"><div class="tlive__frame"><img alt="" width="720" height="900"></div>' +
        '<div class="tload" aria-hidden="true"><div class="tload__bar"><span></span></div><p class="tload__step"></p></div></div><p class="tlive__cap"></p>';
      gallery.insertBefore(live, gallery.firstChild);
    }
    return live;
  };
  /* While the illustration is made: the customer's photo «being drawn» (sketch look, a brush sweep,
     a progress bar and steps that change), in the gallery and in the status line */
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
    el.querySelector('img').src = photo;
    el.hidden = false;
    el.classList.remove('is-loading');
    void el.offsetWidth; /* restart the progress bar */
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
  const showLive = function (url) {
    if (!ensureLive()) return;
    const img = live.querySelector('img');
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
    urlInput.value = '';
    if (nameProp) nameProp.value = '';
    if (fontProp) fontProp.value = '';
    if (colorProp) colorProp.value = '';
    result.hidden = true;
    if (live) live.hidden = true;
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
  const poll = function (id, tries) {
    return fetch(endpoint + '/preview/' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.status === 'succeeded' && res.url) return res.url;
        if (res.status === 'failed' || res.status === 'canceled' || res.error || tries > 60) throw new Error('failed');
        return wait(2500).then(function () { return poll(id, tries + 1); });
      });
  };

  go.addEventListener('click', function () {
    if (go.disabled) return;
    go.disabled = true;
    go.classList.add('is-loading');
    startLoading();
    const name = nameInput ? nameInput.value.trim() : '';
    fetch(endpoint + '/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: d.template, name: name, image: photo,
        font: picked('data-tstudio-font') ? picked('data-tstudio-font').value : '',
        color: picked('data-tstudio-color') ? picked('data-tstudio-color').value : ''
      })
    })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, status: r.status, body: b }; }); })
      .then(function (res) {
        if (res.status === 429) throw new Error('limit');
        if (!res.ok || !res.body.id) throw new Error('failed');
        addUse();
        return poll(res.body.id, 0);
      })
      .then(function (url) {
        stopLoading();
        urlInput.value = url;
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
        say(err && err.message === 'limit' ? d.tLimit : d.tError);
      })
      .finally(function () { go.classList.remove('is-loading'); ready(); });
  });

  /* Preview chosen in «Pruébala en todos los estilos» (pz-all-styles.js): use it as this one's */
  try {
    const hand = JSON.parse(sessionStorage.getItem('arsnoir-pz-handoff') || 'null');
    if (hand && hand.template === d.template && hand.url && Date.now() - hand.at < 50 * 60 * 1000) {
      sessionStorage.removeItem('arsnoir-pz-handoff');
      urlInput.value = hand.url;
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
