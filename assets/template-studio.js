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
  let photo = null;

  const used = function () {
    try { return parseInt(localStorage.getItem(d.key) || '0', 10); } catch (e) { return 0; }
  };
  const addUse = function () {
    try { localStorage.setItem(d.key, String(used() + 1)); } catch (e) {}
  };
  /* A new photo or name invalidates the previous preview */
  const reset = function () {
    urlInput.value = '';
    if (nameProp) nameProp.value = '';
    result.hidden = true;
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
    say(d.tWorking);
    const name = nameInput ? nameInput.value.trim() : '';
    fetch(endpoint + '/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: d.template, name: name, image: photo })
    })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, status: r.status, body: b }; }); })
      .then(function (res) {
        if (res.status === 429) throw new Error('limit');
        if (!res.ok || !res.body.id) throw new Error('failed');
        addUse();
        return poll(res.body.id, 0);
      })
      .then(function (url) {
        urlInput.value = url;
        if (nameProp) nameProp.value = name.toUpperCase();
        resultImg.src = url;
        result.hidden = false;
        const left = max - used();
        say(left > 0 ? (d.tLeft || '').replace('[N]', left) : '');
      })
      .catch(function (err) { say(err && err.message === 'limit' ? d.tLimit : d.tError); })
      .finally(function () { go.classList.remove('is-loading'); ready(); });
  });

  if (used() >= max) say(d.tLimit);
  ready();
})();
