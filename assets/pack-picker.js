/* «1 obra / 2 obras −15 %» (snippets/pack-picker.liquid): sets the quantity of the product form
   and keeps the tile prices and the add-to-cart button on the selected variant. The discount
   itself is Shopify's automatic one, applied in the cart. */
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
  const json = document.querySelector('variant-picker script[type="application/json"]');
  const variants = json ? JSON.parse(json.textContent) : [];
  const lang = document.documentElement.lang || 'es';
  const currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'EUR';
  const money = function (cents) { return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(cents / 100); };
  const set = function (sel, text) { const el = box.querySelector(sel); if (el) el.textContent = text; };

  const sync = function () {
    const v = variants.find(function (x) { return String(x.id) === String(idInput.value); });
    const n = parseInt(qty.value, 10) || 1;
    tiles.forEach(function (t) {
      const on = parseInt(t.dataset.packQty, 10) === (n >= min ? min : 1);
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (!v) return;
    const full = v.price * min;
    const packed = Math.round(full * keep);
    set('[data-pack-one]', money(v.price));
    set('[data-pack-full]', money(full));
    set('[data-pack-total]', money(packed));
    set('[data-pack-saved]', money(full - packed));
    /* The button shows what this line will cost in the cart */
    if (button && v.available && 'withPrice' in button.dataset) {
      button.textContent = button.dataset.addText + ' · ' + money(n >= min ? Math.round(v.price * n * keep) : v.price * n);
    }
  };

  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      qty.value = t.dataset.packQty;
      qty.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  /* Variant changes rewrite the button: re-apply after theme.js has run */
  document.addEventListener('change', function () { requestAnimationFrame(sync); });
  document.addEventListener('click', function (event) {
    if (event.target.closest('variant-picker, [data-qty]')) requestAnimationFrame(sync);
  });
  sync();
})();
