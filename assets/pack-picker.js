/* «1 obra / 2 obras −15 %» (snippets/pack-picker.liquid). «2 obras» opens a search over every work
   of the shop (/collections/obras/products.json) to pick the second one, in the same size and finish
   as this one when it exists; or this same work twice. Tapping a work adds it to the cart right away
   with this one (theme.js submit, [data-pack-extra]); the discount itself is Shopify's automatic one. */
(function () {
  const box = document.querySelector('[data-pack-picker]');
  if (!box || box.dataset.ready) return;
  box.dataset.ready = '1';
  const form = document.getElementById(box.dataset.form);
  if (!form) return;
  const qty = form.querySelector('input[name="quantity"]');
  const idInput = form.querySelector('input[name="id"]');
  const button = form.querySelector('button[type="submit"]');
  const min = parseInt(box.dataset.min, 10) || 2;
  const keep = (100 - (parseInt(box.dataset.pct, 10) || 0)) / 100;
  const tiles = box.querySelectorAll('[data-pack-qty]');
  const more = box.querySelector('[data-pack-more]');
  const same = box.querySelector('[data-pack-same]');
  const q = box.querySelector('[data-pack-q]');
  const list = box.querySelector('[data-pack-list]');
  const empty = box.querySelector('[data-pack-empty]');
  const extraInput = box.querySelector('[data-pack-extra]');
  const create = box.querySelector('[data-pack-create]');
  const sameText = same ? same.textContent : '';
  const json = document.querySelector('variant-picker script[type="application/json"]');
  const variants = json ? JSON.parse(json.textContent) : [];
  const root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
  const lang = document.documentElement.lang || 'es';
  const currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'EUR';
  const money = function (cents) { return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(cents / 100); };
  const set = function (sel, text) { const el = box.querySelector(sel); if (el) el.textContent = text; };
  const plain = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  const esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  const mainVariant = function () { return variants.find(function (x) { return String(x.id) === String(idInput.value); }); };
  const setQty = function (n) {
    if (String(qty.value) === String(n)) return;
    qty.value = n;
    qty.dispatchEvent(new Event('change', { bubbles: true }));
  };

  /* The works to choose from, loaded the first time the search opens */
  let works = null, loading = null, picked = null;
  const load = function () {
    if (works) return Promise.resolve(works);
    if (loading) return loading;
    loading = fetch(root + 'collections/obras/products.json?limit=250')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        const self = String(more.dataset.current);
        works = (data.products || []).filter(function (p) {
          return String(p.id) !== self && p.images && p.images.length && p.variants.some(function (v) { return v.available; });
        }).map(function (p) {
          return { id: p.id, title: p.title, handle: p.handle, img: p.images[0].src, variants: p.variants,
            text: plain(p.title + ' ' + (p.tags || []).join(' ') + ' ' + (p.product_type || '')) };
        });
        return works;
      })
      .catch(function () { loading = null; return []; });
    return loading;
  };
  /* Same size and finish as this work when that variant exists, else its cheapest available one */
  const variantFor = function (w) {
    const m = mainVariant();
    const key = m ? m.title : more.dataset.key;
    return w.variants.find(function (v) { return v.available && v.title === key; }) ||
      w.variants.filter(function (v) { return v.available; }).sort(function (a, b) { return parseFloat(a.price) - parseFloat(b.price); })[0];
  };
  const cents = function (price) { return Math.round(parseFloat(price) * 100); };
  const thumb = function (src) { return src + (src.indexOf('?') === -1 ? '?' : '&') + 'width=240'; };

  const render = function () {
    if (!works) return;
    const words = plain(q.value).split(/\s+/).filter(Boolean);
    const found = works.filter(function (w) { return words.every(function (word) { return w.text.indexOf(word) !== -1; }); });
    /* The picked one stays first so it never disappears while searching */
    if (picked) {
      const i = found.findIndex(function (w) { return w.id === picked.id; });
      if (i > 0) found.unshift(found.splice(i, 1)[0]);
      if (i === -1) found.unshift(picked);
    }
    const shown = found.slice(0, words.length ? 30 : 12);
    list.innerHTML = shown.map(function (w) {
      const v = variantFor(w);
      const on = picked && picked.id === w.id;
      return '<li><button type="button" class="ppick__work' + (on ? ' is-on' : '') + '" data-work="' + w.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        '<img src="' + esc(thumb(w.img)) + '" alt="" loading="lazy" width="120" height="150">' +
        '<span class="ppick__work-name">' + esc(w.title) + '</span>' +
        '<span class="ppick__work-price">' + (v ? money(cents(v.price)) : '') + '</span>' +
        '<span class="ppick__work-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></span>' +
        '</button></li>';
    }).join('');
    empty.hidden = shown.length > 0;
  };
  const pick = function (w) {
    picked = w;
    const v = w ? variantFor(w) : null;
    extraInput.value = v ? v.id : '';
    extraInput.dataset.price = v ? cents(v.price) : 0;
    if (w && (parseInt(qty.value, 10) || 1) >= min) setQty(1);
    render();
    sync();
  };

  const openMore = function (on) {
    if (!more) return;
    more.hidden = !on;
    if (on) load().then(render);
  };

  const sync = function () {
    const v = mainVariant();
    const n = parseInt(qty.value, 10) || 1;
    const cwall = Array.prototype.slice.call(document.querySelectorAll('[data-cwall] [data-cwall-pick]:checked'));
    const cwallSum = cwall.reduce(function (sum, p) {
      const sel = p.closest('.cwall__item').querySelector('[data-cwall-variant]');
      const opt = sel.tagName === 'SELECT' ? sel.options[sel.selectedIndex] : sel;
      return sum + (parseInt(opt.dataset.price, 10) || 0);
    }, 0);
    const second = extraInput && extraInput.value ? 1 : 0;
    const pack = n >= min || second || cwall.length > 0 || (more && !more.hidden);
    tiles.forEach(function (t) {
      const on = (parseInt(t.dataset.packQty, 10) > 1) === !!pack;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (same) {
      const twice = n >= min;
      same.classList.toggle('is-active', twice);
      same.setAttribute('aria-pressed', twice ? 'true' : 'false');
      same.textContent = twice ? '✓ ' + sameText.replace(/^O (llévate )?/, '').replace(/^./, function (c) { return c.toUpperCase(); }) : sameText;
    }
    if (!v) return;
    const full = v.price * min;
    const packed = Math.round(full * keep);
    set('[data-pack-one]', money(v.price));
    set('[data-pack-full]', money(full));
    set('[data-pack-total]', money(packed));
    set('[data-pack-saved]', money(full - packed));
    /* The button shows what goes to the cart: this work (× quantity), the second one and any ticked below */
    if (button && v.available && 'withPrice' in button.dataset) {
      const items = n + second + cwall.length;
      const sum = v.price * n + (second ? parseInt(extraInput.dataset.price, 10) || 0 : 0) + cwallSum;
      button.textContent = button.dataset.addText + ' · ' + money(items >= min ? Math.round(sum * keep) : sum);
    }
  };

  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      if (parseInt(t.dataset.packQty, 10) > 1) {
        if (!more) { setQty(min); sync(); return; }
        openMore(true);
        more.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        openMore(false);
        pick(null);
        setQty(1);
      }
      sync();
    });
  });
  if (list) list.addEventListener('click', function (event) {
    const b = event.target.closest('[data-work]');
    if (!b) return;
    const w = works.find(function (x) { return String(x.id) === b.dataset.work; });
    if (picked && w && picked.id === w.id) { pick(null); return; }
    pick(w);
    /* Tapping the second work is the choice: both go to the cart now (theme.js submit) and the drawer
       opens with the pack discount; a personalised one without its illustration stops in the studio */
    if (!w || !extraInput.value || (button && button.disabled)) return;
    if (form.requestSubmit) form.requestSubmit(button || undefined); else form.submit();
  });
  if (q) q.addEventListener('input', render);
  if (same) same.addEventListener('click', function () {
    const twice = (parseInt(qty.value, 10) || 1) >= min;
    if (!twice) pick(null);
    setQty(twice ? 1 : min);
    sync();
  });
  /* A new size or finish: the second work follows it */
  document.addEventListener('change', function (event) {
    if (picked && event.target.closest && event.target.closest('variant-picker')) {
      requestAnimationFrame(function () { pick(picked); });
      return;
    }
    requestAnimationFrame(sync);
  });
  document.addEventListener('click', function (event) {
    if (event.target.closest('variant-picker, [data-qty]')) requestAnimationFrame(sync);
  });
  /* «Crear otra personalizada»: this one goes to the cart (template-studio.js keeps its illustration
     first), then on to Personalízalo to make the next one */
  let goCreate = 0;
  if (create) create.addEventListener('click', function () {
    pick(null);
    setQty(1);
    /* No illustration yet: the studio's own message asks for it, and we stay here */
    const studioUrl = document.querySelector('[data-tstudio-url]');
    goCreate = studioUrl && !studioUrl.value ? 0 : Date.now();
    if (form.requestSubmit) form.requestSubmit(button || undefined); else form.submit();
  });
  document.addEventListener('cart:added', function () {
    if (goCreate && Date.now() - goCreate < 20000) window.location.href = root + 'collections/personalizalo';
  });
  /* Both went to the cart: start again from «1 obra» */
  document.addEventListener('pack:added', function () { pick(null); setQty(1); openMore(false); if (q) q.value = ''; sync(); });
  sync();
})();
