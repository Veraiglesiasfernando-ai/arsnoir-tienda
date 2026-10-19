/* «1 obra / 2 obras −15 %» (snippets/pack-picker.liquid). «2 obras» brings the «Completa tu pared»
   list (snippets/complete-wall.liquid) right under the tiles so the customer ticks a second work,
   or takes this same one twice. The ticked works go to the cart with this one (theme.js submit);
   the discount itself is Shopify's automatic one, applied in the cart. */
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
  const slot = box.querySelector('[data-pack-slot]');
  const same = box.querySelector('[data-pack-same]');
  const cwall = document.querySelector('[data-cwall]');
  const home = cwall ? document.createComment('cwall') : null;
  if (cwall) cwall.parentNode.insertBefore(home, cwall);
  const json = document.querySelector('variant-picker script[type="application/json"]');
  const variants = json ? JSON.parse(json.textContent) : [];
  const lang = document.documentElement.lang || 'es';
  const currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'EUR';
  const money = function (cents) { return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(cents / 100); };
  const set = function (sel, text) { const el = box.querySelector(sel); if (el) el.textContent = text; };

  const setQty = function (n) {
    if (String(qty.value) === String(n)) return;
    qty.value = n;
    qty.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const picks = function () {
    return cwall ? Array.prototype.slice.call(cwall.querySelectorAll('[data-cwall-pick]:checked')) : [];
  };
  const unpick = function () {
    picks().forEach(function (p) { p.checked = false; p.dispatchEvent(new Event('change', { bubbles: true })); });
  };
  const pickedSum = function () {
    return picks().reduce(function (sum, p) {
      const v = p.closest('.cwall__item').querySelector('[data-cwall-variant]');
      const opt = v.tagName === 'SELECT' ? v.options[v.selectedIndex] : v;
      return sum + (parseInt(opt.dataset.price, 10) || 0);
    }, 0);
  };
  const openMore = function (on) {
    if (!more || !cwall) return;
    more.hidden = !on;
    if (on && cwall.parentNode !== slot) slot.appendChild(cwall);
    if (!on && cwall.parentNode === slot) home.parentNode.insertBefore(cwall, home.nextSibling);
    cwall.classList.toggle('cwall--inpack', on);
  };

  const sync = function () {
    const v = variants.find(function (x) { return String(x.id) === String(idInput.value); });
    const n = parseInt(qty.value, 10) || 1;
    const extra = picks().length;
    const pack = n >= min || extra > 0 || (more && !more.hidden);
    tiles.forEach(function (t) {
      const on = (parseInt(t.dataset.packQty, 10) > 1) === pack;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (same) {
      const twice = n >= min;
      same.classList.toggle('is-active', twice);
      same.setAttribute('aria-pressed', twice ? 'true' : 'false');
      same.textContent = twice ? '✓ Esta misma dos veces' : 'O llévate esta misma dos veces';
    }
    if (!v) return;
    const full = v.price * min;
    const packed = Math.round(full * keep);
    set('[data-pack-one]', money(v.price));
    set('[data-pack-full]', money(full));
    set('[data-pack-total]', money(packed));
    set('[data-pack-saved]', money(full - packed));
    /* The button shows what goes to the cart: this work (× quantity) plus the ticked ones */
    if (button && v.available && 'withPrice' in button.dataset) {
      const items = n + extra;
      const sum = v.price * n + pickedSum();
      button.textContent = button.dataset.addText + ' · ' + money(items >= min ? Math.round(sum * keep) : sum);
    }
  };

  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      if (parseInt(t.dataset.packQty, 10) > 1) {
        /* No list to choose from (or nothing else in stock): the same work twice, as before */
        if (!cwall) { setQty(min); return; }
        openMore(true);
        more.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        openMore(false);
        unpick();
        setQty(1);
      }
      sync();
    });
  });
  if (same) same.addEventListener('click', function () {
    const twice = (parseInt(qty.value, 10) || 1) >= min;
    if (!twice) unpick();
    setQty(twice ? 1 : min);
    sync();
  });
  /* Ticking another work: one of each, not this one twice */
  if (cwall) cwall.addEventListener('change', function (event) {
    if (event.target.matches('[data-cwall-pick]') && event.target.checked && (parseInt(qty.value, 10) || 1) >= min) setQty(1);
    requestAnimationFrame(sync);
  });
  /* Variant changes rewrite the button: re-apply after theme.js has run */
  document.addEventListener('change', function () { requestAnimationFrame(sync); });
  document.addEventListener('click', function (event) {
    if (event.target.closest('variant-picker, [data-qty]')) requestAnimationFrame(sync);
  });
  sync();
})();
