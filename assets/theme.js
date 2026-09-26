/* ARS NOIR — theme scripts (no dependencies) */

(function () {
  const lang = document.documentElement.lang || 'es';
  const S = window.themeStrings || {};

  /* Q4 season: phase by date (early access → Black Friday → Christmas → Reyes → last minute) */
  const Q = window.q4 || {};
  const pad = function (n) { return String(n).padStart(2, '0'); };
  const isoDay = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const parseDay = function (s, endOfDay) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    return endOfDay ? new Date(+m[1], m[2] - 1, +m[3], 23, 59, 59) : new Date(+m[1], m[2] - 1, +m[3]);
  };
  const q4Phase = (function () {
    let forced = null;
    try {
      const param = new URLSearchParams(location.search).get('q4');
      if (param === 'auto') sessionStorage.removeItem('q4');
      else if (param) sessionStorage.setItem('q4', param);
      forced = sessionStorage.getItem('q4');
    } catch (e) { /* storage blocked */ }
    if (!forced && Q.preview && Q.preview !== 'auto') forced = Q.preview;
    if (forced) return forced;
    if (!Q.enabled) return 'off';
    const today = isoDay(new Date());
    if (!Q.start || today < Q.start) return 'off';
    if (today < Q.bfStart) return 'prebf';
    if (today <= Q.bfEnd) return 'bf';
    if (today <= Q.xmas) return 'xmas';
    if (today <= Q.reyes) return 'reyes';
    if (today <= Q.end) return 'late';
    return 'off';
  })();
  document.documentElement.dataset.q4 = q4Phase;

  const longDate = function (s) {
    const d = parseDay(s);
    return d ? new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long' }).format(d) : '';
  };
  const tokens = { '[BLACKFRIDAY]': longDate(Q.bfDay), '[FIN_BF]': longDate(Q.bfEnd), '[NAVIDAD]': longDate(Q.xmas), '[REYES]': longDate(Q.reyes) };

  /* Show only today's phase; also runs on the cart drawer after each re-render */
  function applyQ4(root) {
    root.querySelectorAll('[data-q4]').forEach(function (el) {
      const on = el.dataset.q4.split(' ').indexOf(q4Phase) !== -1;
      if (!on && el.classList.contains('announce__msg')) { el.remove(); return; }
      el.hidden = !on;
    });
    root.querySelectorAll('[data-q4-fill]').forEach(function (el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeValue.indexOf('[') === -1) continue;
        Object.keys(tokens).forEach(function (t) { node.nodeValue = node.nodeValue.split(t).join(tokens[t]); });
      }
    });
  }
  applyQ4(document);
  document.querySelectorAll('[data-announce]').forEach(function (bar) {
    const first = bar.querySelector('.announce__msg');
    if (first) first.classList.add('is-active');
  });

  /* Countdowns to the Q4 dates (looked up every second, so re-rendered carts keep ticking) */
  if (q4Phase !== 'off') {
    const tick = function () {
      document.querySelectorAll('[data-countdown]').forEach(function (el) {
        if (el.closest('[hidden]')) return;
        const target = parseDay(Q[el.dataset.countdown], !el.hasAttribute('data-countdown-start'));
        if (!target) { el.hidden = true; return; }
        let left = Math.max(0, Math.floor((target - Date.now()) / 1000));
        const parts = { d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60 };
        el.querySelectorAll('[data-unit]').forEach(function (u) { u.textContent = pad(parts[u.dataset.unit]); });
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* "Recíbelo entre el … y el …" (business days, Spanish national holidays skipped) */
  const HOLIDAYS = ['01-01', '01-06', '05-01', '08-15', '10-12', '11-01', '12-06', '12-08', '12-25'];
  const addBusinessDays = function (from, n) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    let added = 0;
    while (added < n) {
      d.setDate(d.getDate() + 1);
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6 && HOLIDAYS.indexOf(pad(d.getMonth() + 1) + '-' + pad(d.getDate())) === -1) added++;
    }
    return d;
  };
  const shortDate = function (d) { return new Intl.DateTimeFormat(lang, { weekday: 'short', day: 'numeric', month: 'short' }).format(d); };
  function fillDelivery(root) {
    (root || document).querySelectorAll('[data-delivery]').forEach(function (box) {
      if (box.dataset.filled) return;
      box.dataset.filled = '1';
      const now = new Date();
      const min = addBusinessDays(now, Q.deliveryMin || 4);
      const max = addBusinessDays(now, Math.max(Q.deliveryMax || 5, Q.deliveryMin || 4));
      box.querySelector('[data-delivery-text]').textContent = (S.delivery || 'Pídelo hoy y recíbelo entre el [MIN] y el [MAX]')
        .replace('[MIN]', shortDate(min)).replace('[MAX]', shortDate(max));
      const badge = box.querySelector('[data-delivery-badge]');
      if (badge && ['bf', 'xmas', 'reyes'].indexOf(q4Phase) !== -1) {
        const y = max.getMonth() === 0 ? max.getFullYear() - 1 : max.getFullYear();
        const xmasEve = new Date(y, 11, 24, 23, 59);
        const reyesEve = new Date(y + 1, 0, 5, 23, 59);
        const text = max <= xmasEve ? S.beforeXmas : (max <= reyesEve ? S.beforeReyes : '');
        if (text) { badge.textContent = text; badge.hidden = false; }
      }
      box.hidden = false;
    });
  }
  fillDelivery();
  const cartDrawerEl = document.querySelector('[data-cart-drawer]');
  if (cartDrawerEl && window.MutationObserver) {
    new MutationObserver(function () { applyQ4(cartDrawerEl); fillDelivery(cartDrawerEl); }).observe(cartDrawerEl, { childList: true, subtree: true });
  }

  /* Copy-to-clipboard buttons outside the pop-up (e.g. the Black Friday code) */
  document.addEventListener('click', function (event) {
    const copy = event.target.closest('[data-copy]');
    if (!copy || copy.closest('[data-npop]') || !navigator.clipboard) return;
    navigator.clipboard.writeText(copy.dataset.copy).then(function () {
      const l = copy.querySelector('[data-copy-label]');
      if (l) l.textContent = S.copied || '¡Copiado!';
    });
  });
  const currency = (window.Shopify && Shopify.currency && Shopify.currency.active) || 'EUR';

  function formatMoney(cents) {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(cents / 100);
  }

  /* Quantity steppers ---------------------------------------------------- */
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-qty]');
    if (!button) return;
    const input = button.parentElement.querySelector('input');
    const min = parseInt(input.min || '0', 10);
    const next = Math.max(min, (parseInt(input.value, 10) || 0) + parseInt(button.dataset.qty, 10));
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* Horizontal slider arrows ------------------------------------------- */
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-scroll]');
    if (!button) return;
    const slider = document.getElementById(button.dataset.target);
    if (!slider) return;
    const item = slider.querySelector('.slider__item');
    const step = item ? item.getBoundingClientRect().width + 20 : slider.clientWidth * 0.8;
    slider.scrollBy({ left: step * parseInt(button.dataset.scroll, 10), behavior: 'smooth' });
  });

  /* Video hero slideshow with progress bars ---------------------------- */
  document.querySelectorAll('[data-vhero]').forEach(function (hero) {
    const slides = hero.querySelectorAll('.vhero__slide');
    const bars = hero.querySelectorAll('.vhero__bar');
    if (slides.length < 2) return;
    const interval = (parseInt(hero.dataset.interval, 10) || 6) * 1000;
    hero.style.setProperty('--vhero-interval', interval + 'ms');
    let current = 0;
    let timer;

    function show(index) {
      slides[current].classList.remove('is-active');
      bars[current].classList.remove('is-active');
      bars.forEach(function (bar, i) { bar.classList.toggle('is-done', i < index); });
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      void bars[current].offsetWidth; /* restart the CSS progress animation */
      bars[current].classList.add('is-active');
      const video = slides[current].querySelector('video');
      if (video) { video.currentTime = 0; video.play().catch(function () {}); }
      clearTimeout(timer);
      timer = setTimeout(function () { show(current + 1); }, interval);
    }

    bars.forEach(function (bar, i) { bar.addEventListener('click', function () { show(i); }); });
    timer = setTimeout(function () { show(1); }, interval);
  });

  /* Header: clean/transparent at the top, glass once the page scrolls */
  const setScrolled = function () {
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  /* Keep the sticky header right under the announcement bar, whatever its height */
  const announce = document.querySelector('.announce');
  if (announce) {
    const setAnnounceHeight = function () {
      document.body.style.setProperty('--announce-h', announce.offsetHeight + 'px');
    };
    setAnnounceHeight();
    if ('ResizeObserver' in window) new ResizeObserver(setAnnounceHeight).observe(announce);
  }

  /* Announcement bar rotation ------------------------------------------ */
  document.querySelectorAll('[data-announce]').forEach(function (bar) {
    const msgs = bar.querySelectorAll('.announce__msg');
    if (msgs.length < 2) return;
    let i = 0;
    setInterval(function () {
      msgs[i].classList.remove('is-active');
      i = (i + 1) % msgs.length;
      msgs[i].classList.add('is-active');
    }, (parseInt(bar.dataset.interval, 10) || 4) * 1000);
  });

  /* Sort select auto-submit --------------------------------------------- */
  document.querySelectorAll('[data-autosubmit]').forEach(function (el) {
    el.addEventListener('change', function () { el.form.submit(); });
  });

  /* Variant picker ------------------------------------------------------- */
  class VariantPicker extends HTMLElement {
    connectedCallback() {
      this.variants = JSON.parse(this.querySelector('[type="application/json"]').textContent);
      this.form = document.getElementById(this.dataset.form);
      this.addEventListener('change', this.onChange.bind(this));
      this.markAvailability();
    }

    selectedOptions() {
      return Array.from(this.querySelectorAll('fieldset')).map(function (fieldset) {
        const checked = fieldset.querySelector('input:checked');
        return checked ? checked.value : null;
      });
    }

    onChange() {
      const selected = this.selectedOptions();
      const variant = this.variants.find(function (v) {
        return v.options.every(function (option, i) { return option === selected[i]; });
      });

      this.querySelectorAll('fieldset').forEach(function (fieldset, i) {
        const label = fieldset.querySelector('[data-selected-value]');
        if (label) label.textContent = selected[i] || '';
      });

      this.markAvailability();

      const button = this.form.querySelector('[type="submit"]');
      const priceEl = document.getElementById(this.dataset.price);

      if (!variant) {
        button.disabled = true;
        button.textContent = button.dataset.unavailableText;
        return;
      }

      this.form.querySelector('input[name="id"]').value = variant.id;
      button.disabled = !variant.available;
      button.textContent = variant.available ? button.dataset.addText : button.dataset.soldOutText;

      if (priceEl) {
        let html = '';
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          html += '<s class="muted">' + formatMoney(variant.compare_at_price) + '</s>';
        }
        html += '<span>' + formatMoney(variant.price) + '</span>';
        priceEl.innerHTML = html;
        document.querySelectorAll('.sticky-buy__price').forEach(function (el) { el.innerHTML = html; });
      }
      document.querySelectorAll('.sticky-buy .button').forEach(function (b) {
        b.disabled = !variant.available;
        b.textContent = variant.available ? (S.addShort || 'Añadir') : button.dataset.soldOutText;
      });

      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());

      if (variant.featured_media) {
        const media = document.querySelector('[data-media-id="' + variant.featured_media.id + '"]');
        if (media) {
          const gallery = media.parentElement;
          if (gallery.scrollWidth > gallery.clientWidth) {
            gallery.scrollTo({ left: media.offsetLeft - gallery.offsetLeft, behavior: 'smooth' });
          } else if (media.getBoundingClientRect().top < 0 || media.getBoundingClientRect().top > window.innerHeight) {
            media.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }

    /* Grey out option values that don't combine with the current selection */
    markAvailability() {
      const selected = this.selectedOptions();
      const variants = this.variants;
      this.querySelectorAll('fieldset').forEach(function (fieldset, index) {
        fieldset.querySelectorAll('input').forEach(function (input) {
          const exists = variants.some(function (v) {
            return v.available && v.options[index] === input.value && v.options.every(function (o, i) {
              return i === index || selected[i] === null || i > index || o === selected[i];
            });
          });
          input.classList.toggle('is-unavailable', !exists);
        });
      });
    }
  }


  /* Scroll reveal (only when JS runs; content is visible without it) ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Collection filters: submit on change ------------------------------- */
  document.querySelectorAll('[data-filter-form]').forEach(function (form) {
    let t;
    form.addEventListener('change', function (event) {
      clearTimeout(t);
      const delay = event.target.type === 'number' ? 700 : 0;
      t = setTimeout(function () { form.submit(); }, delay);
    });
  });

  /* Sticky buy bar on mobile product pages ----------------------------- */
  const stickyBuy = document.querySelector('[data-sticky-buy]');
  const buyForm = document.querySelector('form[data-ajax-cart]');
  if (stickyBuy && buyForm && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      const hidden = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      stickyBuy.classList.toggle('is-visible', hidden);
      stickyBuy.setAttribute('aria-hidden', hidden ? 'false' : 'true');
    }).observe(buyForm);
  }

  /* Cart drawer -------------------------------------------------------- */
  const root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
  let lastFocus = null;

  function drawer() { return document.querySelector('[data-cart-drawer]'); }

  function openDrawer() {
    const d = drawer();
    if (!d) return false;
    lastFocus = document.activeElement;
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('drawer-open');
    const panel = d.querySelector('.drawer__panel');
    if (panel) panel.focus();
    return true;
  }

  /* Closing the cart with items and no code yet: offer the welcome discount once */
  function closeDrawer() {
    if (shouldOfferExit()) { openExit(); return; }
    closeDrawerNow();
  }

  function closeDrawerNow() {
    const d = drawer();
    if (!d) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('drawer-open');
    if (lastFocus) lastFocus.focus();
  }

  function updateCount(count) {
    document.querySelectorAll('.glass-header__cart').forEach(function (link) {
      let badge = link.querySelector('.cart-count');
      if (count > 0) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'cart-count'; link.appendChild(badge); }
        badge.textContent = count;
      } else if (badge) {
        badge.remove();
      }
      link.setAttribute('aria-label', (S.cartCount || 'Carrito, [count] artículos').replace('[count]', count));
    });
  }

  function refreshDrawer(skipGiftSync) {
    return fetch(root + '?sections=cart-drawer')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        const html = new DOMParser().parseFromString(data['cart-drawer'], 'text/html');
        const fresh = html.querySelector('.drawer__panel');
        const current = drawer() && drawer().querySelector('.drawer__panel');
        if (fresh && current) current.innerHTML = fresh.innerHTML;
        return fetch(root + 'cart.js');
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCount(cart.item_count);
        if (skipGiftSync) return;
        return syncGift(cart).then(function (changed) { if (changed) return refreshDrawer(true); });
      });
  }

  /* Gift artwork: the customer picks it (gift size, no frame) once a tier is reached.
     Here we only take gifts away: above the unlocked tier, or when Shopify does not make
     them free because a discount code that doesn't combine is applied. Prices stay Shopify's. */
  function cartConfig() {
    const el = document.querySelector('[data-cart-config]');
    try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; }
  }
  let giftBusy = false;
  function syncGift(cart) {
    const c = cartConfig();
    if (!c || !c.giftEnabled || giftBusy) return Promise.resolve(false);
    const isGift = function (i) { return i.properties && i.properties._regalo; };
    const gifts = cart.items.filter(isGift);
    if (!gifts.length) return Promise.resolve(false);
    const others = cart.items.filter(function (i) { return !isGift(i); });
    const eligible = others.reduce(function (sum, i) { return sum + i.final_line_price; }, 0);
    let allowed = others.length === 0 ? 0 : eligible >= c.tier2 ? 2 : eligible >= c.tier1 ? 1 : 0;
    const hasCode = (cart.cart_level_discount_applications || []).some(function (d) { return d.type === 'discount_code'; }) ||
      cart.items.some(function (i) { return (i.line_level_discount_allocations || []).some(function (a) { return a.discount_application.type === 'discount_code'; }); });
    if (hasCode && gifts.some(function (i) { return i.final_line_price > 0; })) allowed = 0;
    let have = gifts.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    if (have <= allowed) return Promise.resolve(false);

    giftBusy = true;
    const json = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    let chain = Promise.resolve();
    /* Drop the most recently added gifts first */
    gifts.slice().reverse().forEach(function (g) {
      if (have <= allowed) return;
      const keep = Math.max(0, g.quantity - (have - allowed));
      have -= g.quantity - keep;
      chain = chain.then(function () {
        return fetch(root + 'cart/change.js', { method: 'POST', headers: json, body: JSON.stringify({ id: g.key, quantity: keep }) });
      });
    });
    return chain.then(function () { return true; }, function () { return false; }).finally(function () { giftBusy = false; });
  }

  /* "Elige tu obra de regalo" */
  document.addEventListener('click', function (event) {
    const pick = event.target.closest('[data-gift-pick]');
    if (!pick) return;
    document.querySelectorAll('[data-gift-pick]').forEach(function (b) { b.disabled = true; });
    pick.classList.add('is-loading');
    fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(pick.dataset.variant, 10), quantity: 1, properties: { _regalo: '1' } }] })
    })
      .then(function () { return refreshDrawer(); })
      .catch(function () { document.querySelectorAll('[data-gift-pick]').forEach(function (b) { b.disabled = false; }); });
  });

  /* On load: bring the gift line up to date (e.g. after a discount change at checkout) */
  if (drawer() && (cartConfig() || {}).giftEnabled) {
    fetch(root + 'cart.js').then(function (r) { return r.json(); }).then(function (cart) {
      return syncGift(cart).then(function (changed) { if (changed) return refreshDrawer(true); });
    }).catch(function () {});
  }

  /* Shipping in the cart: Shopify's cheapest real rate for the visitor's country */
  function fillShipping(container) {
    (container || document).querySelectorAll('[data-ship-estimate]').forEach(function (el) {
      if (el.dataset.done || !el.dataset.country) return;
      el.dataset.done = '1';
      fetch(root + 'cart/shipping_rates.json?shipping_address%5Bcountry%5D=' + encodeURIComponent(el.dataset.country))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          const rates = data && data.shipping_rates;
          if (!rates || !rates.length) return;
          const min = Math.min.apply(null, rates.map(function (r) { return Math.round(parseFloat(r.price) * 100); }));
          el.textContent = min === 0 ? (S.free || 'GRATIS') : (S.shipFrom || 'desde [AMOUNT]').replace('[AMOUNT]', formatMoney(min));
        })
        .catch(function () { /* keep "se calcula en el pago" */ });
    });
  }
  fillShipping();
  if (cartDrawerEl && window.MutationObserver) {
    new MutationObserver(function () { fillShipping(cartDrawerEl); }).observe(cartDrawerEl, { childList: true, subtree: true });
  }

  /* Welcome discount when closing the cart ---------------------------------- */
  function exitEl() { return document.querySelector('[data-cart-exit]'); }
  function shouldOfferExit() {
    const e = exitEl();
    const d = drawer();
    const panel = d && d.querySelector('.drawer__panel');
    const c = cartConfig();
    if (!e || !panel || !c || !c.exitEnabled || !c.exitCode) return false;
    /* Never offer 10% on top of a better deal already applied (pack, gift) or to someone who already said no */
    if (!d.classList.contains('is-open') || panel.dataset.itemCount === '0' || panel.dataset.hasCode === 'true' || panel.dataset.hasDiscount === 'true') return false;
    try {
      if (localStorage.getItem('arsnoir:cartExit')) return false;
      const np = JSON.parse(localStorage.getItem('arsnoir:npop') || '{}');
      if (np.subscribed || np.until > Date.now()) return false;
    } catch (err) { /* storage blocked: offer it */ }
    return true;
  }
  function openExit() {
    const e = exitEl();
    try { localStorage.setItem('arsnoir:cartExit', String(Date.now())); } catch (err) { /* ignore */ }
    e.hidden = false;
    requestAnimationFrame(function () { e.classList.add('is-open'); });
    const field = e.querySelector('input[type="email"]');
    if (field) setTimeout(function () { field.focus({ preventScroll: true }); }, 250);
  }
  function closeExit(alsoDrawer) {
    const e = exitEl();
    if (!e || e.hidden) return;
    e.classList.remove('is-open');
    setTimeout(function () { e.hidden = true; }, 250);
    if (alsoDrawer) closeDrawerNow();
  }
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-cart-exit-decline], [data-cart-exit-close]')) closeExit(true);
  });
  document.addEventListener('keydown', function (event) {
    const e = exitEl();
    if (event.key === 'Escape' && e && !e.hidden) { event.stopImmediatePropagation(); closeExit(true); }
  }, true);
  document.addEventListener('submit', function (event) {
    const form = event.target.closest('#CartExitForm');
    if (!form) return;
    event.preventDefault();
    const e = exitEl();
    const c = cartConfig();
    const button = form.querySelector('[type="submit"]');
    button.classList.add('is-loading');
    const json = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function () {
        return fetch(root + 'cart/update.js', { method: 'POST', headers: json, body: JSON.stringify({ discount: c.exitCode }) });
      })
      .then(function (r) {
        if (!r.ok) return fetch(root + 'discount/' + encodeURIComponent(c.exitCode) + '?redirect=' + encodeURIComponent(root + 'cart.js'));
        return r;
      })
      .then(function () {
        try { localStorage.setItem('arsnoir:npop', JSON.stringify({ subscribed: true })); } catch (err) { /* ignore */ }
        e.querySelector('[data-cart-exit-form]').hidden = true;
        e.querySelector('[data-cart-exit-decline]').hidden = true;
        e.querySelector('[data-cart-exit-ok]').hidden = false;
        return refreshDrawer();
      })
      .then(function () { setTimeout(function () { closeExit(false); }, 1600); })
      .catch(function () { e.querySelector('[data-cart-exit-error]').hidden = false; })
      .finally(function () { button.classList.remove('is-loading'); });
  });

  /* Cart: swap an unframed line for the same size with black frame ---------- */
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-frame-upgrade]');
    if (!button) return;
    button.disabled = true;
    button.classList.add('is-loading');
    const json = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    fetch(root + 'cart/add.js', {
      method: 'POST', headers: json,
      body: JSON.stringify({ items: [{ id: parseInt(button.dataset.variant, 10), quantity: parseInt(button.dataset.quantity, 10) || 1 }] })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('add');
        return fetch(root + 'cart/change.js', { method: 'POST', headers: json, body: JSON.stringify({ id: button.dataset.key, quantity: 0 }) });
      })
      .then(refreshDrawer)
      .catch(function () { button.disabled = false; button.classList.remove('is-loading'); alert(S.addError || 'No se ha podido añadir al carrito.'); });
  });

  /* Wall packs: add every artwork of the pack at once ---------------------- */
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-pack-add]');
    if (!button || !button.dataset.packAdd) return;
    const items = button.dataset.packAdd.split(',').map(function (id) { return { id: parseInt(id, 10), quantity: 1 }; });
    button.classList.add('is-loading');
    fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (res) {
        if (!res.ok) { alert(res.body.description || S.packError || 'No se ha podido añadir el pack.'); return; }
        return drawer() ? refreshDrawer().then(openDrawer) : (window.location.href = root + 'cart');
      })
      .finally(function () { button.classList.remove('is-loading'); });
  });

  /* Discount pop-up -------------------------------------------------------- */
  const npop = document.querySelector('[data-npop]');
  if (npop) {
    const KEY = 'arsnoir:npop';
    const days = parseInt(npop.dataset.days, 10) || 14;
    let shown = false;
    const openPop = function () {
      if (shown) return;
      shown = true;
      npop.hidden = false;
      requestAnimationFrame(function () { npop.classList.add('is-open'); });
      const field = npop.querySelector('input[type="email"]');
      if (field) setTimeout(function () { field.focus({ preventScroll: true }); }, 300);
    };
    const closePop = function () {
      npop.classList.remove('is-open');
      setTimeout(function () { npop.hidden = true; }, 300);
      if (!store.get(KEY).subscribed) store.set(KEY, { until: Date.now() + days * 864e5 });
    };
    const success = npop.querySelector('[data-npop-success]');
    const saved = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
    const cookieOpen = function () { const c = document.querySelector('[data-cookie-banner]'); return c && !c.hidden; };

    /* Smart trigger: only after real interest (page views in this visit) or when leaving;
       never on the cart, never over the open cart drawer or the cookie banner. */
    let pv = 1;
    try { pv = (parseInt(sessionStorage.getItem('arsnoir:pv'), 10) || 0) + 1; sessionStorage.setItem('arsnoir:pv', String(pv)); } catch (e) { /* ignore */ }
    const busy = function () {
      const d = document.querySelector('[data-cart-drawer]');
      const x = document.querySelector('[data-cart-exit]');
      return cookieOpen() || (d && d.classList.contains('is-open')) || (x && !x.hidden);
    };
    const tryOpen = function () { if (busy()) { setTimeout(tryOpen, 1500); } else { openPop(); } };

    if (success) {
      store.set(KEY, { subscribed: true });
      openPop();
      /* Apply the welcome code to the cart straight away (Shopify validates it at checkout) */
      if (npop.dataset.code) {
        fetch(root + 'cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ discount: npop.dataset.code })
        }).then(function (r) {
          if (!r.ok) return fetch(root + 'discount/' + encodeURIComponent(npop.dataset.code) + '?redirect=' + encodeURIComponent(root + 'cart.js'));
        }).then(function () { if (drawer()) return refreshDrawer(); }).catch(function () {});
      }
    } else if (npop.hasAttribute('data-preview')) {
      openPop();
    } else if (!saved.subscribed && !(saved.until > Date.now()) && document.body.dataset.template !== 'cart') {
      const minPages = parseInt(npop.dataset.minPages, 10) || 2;
      const delay = (parseInt(npop.dataset.delay, 10) || 6) * 1000;
      if (pv >= minPages) setTimeout(tryOpen, delay);
      const armedAt = Date.now() + 3000;
      document.addEventListener('mouseout', function (event) {
        if (!event.relatedTarget && event.clientY <= 0 && Date.now() > armedAt && !busy()) openPop();
      });
    }

    npop.addEventListener('click', function (event) {
      if (event.target.closest('[data-npop-close]')) closePop();
      const copy = event.target.closest('[data-copy]');
      if (copy && navigator.clipboard) {
        navigator.clipboard.writeText(copy.dataset.copy).then(function () {
          const l = copy.querySelector('[data-copy-label]');
          if (l) l.textContent = S.copied || '¡Copiado!';
        });
      }
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !npop.hidden) closePop(); });
  }
})();
