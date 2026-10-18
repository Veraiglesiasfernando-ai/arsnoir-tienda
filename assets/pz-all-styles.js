/* Personalízalo · «Pruébala en todos los estilos» (sections/pz-all-styles.liquid).
   One photo → one preview per style through the ARSNOIR worker. «Elegir este» hands the preview
   to the product page (sessionStorage «arsnoir-pz-handoff», read by template-studio.js). */
(function () {
  const box = document.querySelector('[data-pzall]');
  if (!box || box.dataset.ready) return;
  box.dataset.ready = '1';
  const d = box.dataset;
  const endpoint = (d.endpoint || '').replace(/\/$/, '');
  const fileInput = box.querySelector('[data-pzall-file]');
  const thumb = box.querySelector('[data-pzall-thumb]');
  const dropText = box.querySelector('[data-pzall-drop-text]');
  const nameInput = box.querySelector('[data-pzall-name]');
  const go = box.querySelector('[data-pzall-go]');
  const status = box.querySelector('[data-pzall-status]');
  const items = Array.from(box.querySelectorAll('.pzall__item'));
  const max = parseInt(d.max, 10) || 2;
  const KEY = 'arsnoir-pzall-runs';
  let photo = null;
  let busy = false;

  const say = function (t) { status.textContent = t || ''; };
  const runs = function () { try { return parseInt(localStorage.getItem(KEY) || '0', 10); } catch (e) { return 0; } };
  const addRun = function () { try { localStorage.setItem(KEY, String(runs() + 1)); } catch (e) {} };
  const ready = function () { go.disabled = busy || !photo || runs() >= max; };
  const wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* Same resize as the product editor: max 1536 px JPEG */
  fileInput.addEventListener('change', function () {
    const file = fileInput.files && fileInput.files[0];
    photo = null;
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

  /* Start one preview; Replicate throttles small accounts, so retry a few times on «throttled» */
  const start = function (template, name, tries) {
    return fetch(endpoint + '/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: template, name: name, image: photo })
    })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, status: r.status, body: b }; }); },
        function () { return { ok: false, status: 0, body: {} }; })
      .then(function (res) {
        if (res.ok && res.body.id) return res.body.id;
        /* Busy (throttled), a server hiccup or a dropped connection: try again */
        const busy = res.status === 0 || res.status === 429 || res.status >= 500;
        if (busy && tries < 6) return wait(tries === 0 ? 3000 : 11000).then(function () { return start(template, name, tries + 1); });
        throw new Error('failed');
      });
  };
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

  const run = function (item, name) {
    const img = item.querySelector('[data-pzall-img]');
    const spin = item.querySelector('[data-pzall-spin]');
    const note = item.querySelector('[data-pzall-note]');
    const pick = item.querySelector('[data-pzall-pick]');
    const template = item.dataset.template;
    const retry = item.querySelector('[data-pzall-retry]');
    if (item.dataset.needsName === 'true' && !name) {
      /* Made later, with the same photo, once a name is written (no extra run counted) */
      note.textContent = d.tName;
      if (retry) {
        retry.hidden = false;
        retry.onclick = function () {
          const later = nameInput.value.trim();
          if (!later) { nameInput.focus(); return; }
          retry.hidden = true;
          run(item, later);
        };
      }
      return Promise.resolve();
    }
    if (retry) retry.hidden = true;
    note.textContent = '';
    /* The customer's photo softly blurred, with the spinner, while this style is made */
    item.classList.remove('is-done');
    img.onload = null;
    img.src = photo;
    img.hidden = false;
    spin.hidden = false;
    item.classList.add('is-working');
    const attempt = function (n) {
      return start(template, name, 0)
        .then(function (id) { return poll(id, 0).then(function (done) { return { url: done.url, saved: done.saved || '', keep: done.temporary && done.keep ? id : '' }; }); })
        .catch(function (err) { return err && err.message === 'failed' && n < 1 ? attempt(n + 1) : Promise.reject(err); });
    };
    return attempt(0)
      .then(function (out) {
        const url = out.url;
        img.hidden = true;
        img.onload = function () { img.hidden = false; item.classList.add('is-done'); };
        img.src = url;
        pick.hidden = false;
        pick.onclick = function () {
          try {
            sessionStorage.setItem('arsnoir-pz-handoff', JSON.stringify({
              template: template, url: url, saved: out.saved, keep: out.keep, name: item.dataset.needsName === 'true' ? name : '', at: Date.now()
            }));
          } catch (e) {}
        };
      })
      .catch(function () { img.hidden = true; note.textContent = d.tError; })
      .finally(function () { spin.hidden = true; item.classList.remove('is-working'); });
  };

  go.addEventListener('click', function () {
    if (go.disabled) return;
    busy = true;
    ready();
    addRun();
    say(d.tWorking);
    const name = nameInput.value.trim();
    /* One after another: steady with Replicate's limits, and each card fills in as it's ready */
    items.reduce(function (chain, item) {
      return chain.then(function () { return run(item, name); });
    }, Promise.resolve()).then(function () {
      busy = false;
      say(runs() >= max ? d.tLimit : '');
      ready();
      box.querySelector('[data-pzall-grid]').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (runs() >= max) say(d.tLimit);
  ready();
})();
