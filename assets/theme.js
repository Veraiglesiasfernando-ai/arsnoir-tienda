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

  /* Mystery gift: keep the gift line in step with the tier. Prices stay Shopify's:
     if Shopify does not make the gift free (e.g. a code that doesn't combine won),
     the line is removed and not re-added while those discounts stay the same. */
  function cartConfig() {
    const el = document.querySelector('[data-cart-config]');
    try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; }
  }
  let giftBusy = false;
  function syncGift(cart) {
    const c = cartConfig();
    if (!c || !c.giftVariant || giftBusy) return Promise.resolve(false);
    const isGift = function (i) { return i.variant_id === c.giftVariant; };
    const gifts = cart.items.filter(isGift);
    const others = cart.items.filter(function (i) { return !isGift(i); });
    const eligible = others.reduce(function (sum, i) { return sum + i.final_line_price; }, 0);
    const key = (cart.cart_level_discount_applications || []).map(function (d) { return d.title; }).join('|') + '#' +
      others.map(function (i) { return (i.line_level_discount_allocations || []).map(function (a) { return a.discount_application.title; }).join(','); }).join(';');
    let blocked = null;
    try { blocked = sessionStorage.getItem('arsnoir:giftBlocked'); } catch (e) { /* ignore */ }
    let want = !c.giftAvailable || others.length === 0 ? 0 : eligible >= c.tier2 ? 2 : eligible >= c.tier1 ? 1 : 0;
    if (gifts.some(function (i) { return i.final_line_price > 0; })) {
      try { sessionStorage.setItem('arsnoir:giftBlocked', key); } catch (e) { /* ignore */ }
      want = 0;
    } else if (blocked !== null && blocked === key) {
      want = 0;
    }
    const have = gifts.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    if (want === have && gifts.length <= 1) return Promise.resolve(false);

    giftBusy = true;
    const json = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    const change = function (id, quantity) {
      return fetch(root + 'cart/change.js', { method: 'POST', headers: json, body: JSON.stringify({ id: id, quantity: quantity }) });
    };
    let chain = Promise.resolve();
    gifts.slice(want > 0 ? 1 : 0).forEach(function (g) { chain = chain.then(function () { return change(g.key, 0); }); });
    if (want > 0) {
      chain = chain.then(function () {
        if (gifts.length) return change(gifts[0].key, want);
        return fetch(root + 'cart/add.js', { method: 'POST', headers: json, body: JSON.stringify({ items: [{ id: c.giftVariant, quantity: want, properties: { _regalo: 'ARSNOIR misterio' } }] }) });
      });
    }
    return chain.then(function () { return true; }, function () { return false; }).finally(function () { giftBusy = false; });
  }

  document.addEventListener('submit', function (event) {
    const form = event.target.closest('form[data-ajax-cart]');
    if (!form || !drawer() || !window.fetch) return;
    event.preventDefault();
    const buttons = document.querySelectorAll('[form="' + form.id + '"], #' + form.id + ' [type="submit"]');
    buttons.forEach(function (b) { b.classList.add('is-loading'); });
    fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (res) {
        if (!res.ok) { alert(res.body.description || S.addError || 'No se ha podido añadir al carrito.'); return; }
        return refreshDrawer().then(openDrawer);
      })
      .catch(function () { form.submit(); })
      .finally(function () { buttons.forEach(function (b) { b.classList.remove('is-loading'); }); });
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-drawer-close]')) { closeDrawer(); return; }

    const cartLink = event.target.closest('.glass-header__cart');
    if (cartLink && drawer() && document.body.dataset.template !== 'cart') {
      event.preventDefault();
      openDrawer();
      return;
    }

    const change = event.target.closest('[data-cart-change]');
    if (change) {
      change.disabled = true;
      fetch(root + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ line: parseInt(change.dataset.line, 10), quantity: parseInt(change.dataset.quantity, 10) })
      }).then(refreshDrawer);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeDrawer();
  });

  /* Search overlay with predictive results -------------------------------- */
  const search = document.querySelector('[data-search-overlay]');
  if (search) {
    const input = search.querySelector('[data-search-input]');
    const results = search.querySelector('[data-search-results]');
    const popular = search.querySelector('[data-search-popular]');
    let searchFocus = null;
    let timer = null;
    let controller = null;

    const openSearch = function () {
      searchFocus = document.activeElement;
      document.querySelectorAll('.mobile-menu[open]').forEach(function (d) { d.removeAttribute('open'); });
      search.hidden = false;
      requestAnimationFrame(function () { search.classList.add('is-open'); });
      document.documentElement.classList.add('search-open');
      input.focus();
    };
    const closeSearch = function () {
      if (search.hidden) return;
      search.classList.remove('is-open');
      document.documentElement.classList.remove('search-open');
      setTimeout(function () { search.hidden = true; }, 250);
      if (searchFocus) searchFocus.focus();
    };

    const suggest = function (q) {
      if (controller) controller.abort();
      if (!q) { results.innerHTML = ''; popular.hidden = false; return; }
      controller = new AbortController();
      const url = search.dataset.suggestUrl + '?q=' + encodeURIComponent(q) +
        '&section_id=predictive-search&resources[type]=product,collection,query&resources[limit]=6' +
        '&resources[options][fields]=title,product_type,tag,variants.title';
      results.classList.add('is-loading');
      fetch(url, { signal: controller.signal })
        .then(function (r) { return r.text(); })
        .then(function (text) {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const section = doc.querySelector('.shopify-section') || doc.body;
          results.innerHTML = section.innerHTML;
          popular.hidden = true;
          results.classList.remove('is-loading');
        })
        .catch(function () { results.classList.remove('is-loading'); });
    };

    input.addEventListener('input', function () {
      clearTimeout(timer);
      const q = input.value.trim();
      timer = setTimeout(function () { suggest(q); }, 220);
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-search-open]')) { event.preventDefault(); openSearch(); return; }
      if (event.target.closest('[data-search-close]')) closeSearch();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeSearch();
      if (event.key === '/' && search.hidden && !event.target.closest('input, textarea, select, [contenteditable]')) {
        event.preventDefault();
        openSearch();
      }
    });
  }

  if (!customElements.get('variant-picker')) customElements.define('variant-picker', VariantPicker);

  /* Sizes and frames ------------------------------------------------------ */
  const A_SIZES = { a5: [14.8, 21], a4: [21, 29.7], a3: [29.7, 42], a2: [42, 59.4], a1: [59.4, 84], a0: [84, 118.9] };

  /* "50 × 70 cm", "50x70", "A3", "30 x 40 in" → [width, height] in cm */
  function parseSize(text) {
    if (!text) return null;
    const t = String(text).toLowerCase().replace(',', '.');
    const m = t.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const k = /\bin\b|pulg|"/.test(t) ? 2.54 : 1;
      return [parseFloat(m[1]) * k, parseFloat(m[2]) * k];
    }
    const a = t.match(/\ba([0-5])\b/);
    return a ? A_SIZES['a' + a[1]] : null;
  }

  function selectedOf(kind) {
    const input = document.querySelector('fieldset[data-option-kind="' + kind + '"] input:checked');
    return input ? input.value : null;
  }

  function frameKind(value) {
    if (!value) return 'none';
    const input = document.querySelector('fieldset[data-option-kind="frame"] input:checked');
    const swatch = input && input.nextElementSibling && input.nextElementSibling.querySelector('[data-frame-kind]');
    return swatch ? swatch.dataset.frameKind : 'none';
  }

  /* "Mírala en tu pared" --------------------------------------------------- */
  class WallPreview extends HTMLElement {
    connectedCallback() {
      this.stage = this.querySelector('[data-stage]');
      this.art = this.querySelector('[data-art]');
      this.room = this.querySelector('.wallp__room.is-active');
      this.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-room]');
        if (!tab) return;
        this.querySelectorAll('[data-room]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        this.querySelectorAll('[data-room-panel]').forEach((p) => p.classList.toggle('is-active', p.dataset.roomPanel === tab.dataset.room));
        this.room = this.querySelector('.wallp__room.is-active');
        this.update();
      });
      this.onChange = (event) => { if (event.target.closest('variant-picker')) this.update(); };
      document.addEventListener('change', this.onChange);
      this.update();
    }
    disconnectedCallback() { document.removeEventListener('change', this.onChange); }
    update() {
      if (!this.room) return;
      const label = selectedOf('size') || this.dataset.defaultSize;
      const size = parseSize(label) || [50, 70];
      const wall = parseFloat(this.room.dataset.wall) || 300;
      const wallHeight = wall * 0.75; /* stage is 4:3 */
      this.art.style.width = Math.min(96, (size[0] / wall) * 100) + '%';
      this.art.style.height = Math.min(92, (size[1] / wallHeight) * 100) + '%';
      this.art.style.bottom = Math.min(this.room.dataset.bottom || 55, 100 - (size[1] / wallHeight) * 100 - 3) + '%';
      this.art.dataset.frame = frameKind(selectedOf('frame'));
      this.art.style.setProperty('--fw', (3 / wall) * 100 + '%'); /* ~3 cm frame */
      const sizeEl = this.querySelector('[data-wallp-size]');
      const refEl = this.querySelector('[data-wallp-ref]');
      if (sizeEl) sizeEl.textContent = label || '';
      if (refEl) refEl.textContent = this.room.dataset.ref ? '· ' + (S.scaleWith || 'a escala junto a') + ' ' + this.room.dataset.ref : '';
    }
  }
  if (!customElements.get('wall-preview')) customElements.define('wall-preview', WallPreview);

  /* Size comparator -------------------------------------------------------- */
  class SizeCompare extends HTMLElement {
    connectedCallback() {
      this.stage = this.querySelector('[data-stage]');
      this.person = this.querySelector('[data-person]');
      const values = JSON.parse(this.querySelector('[data-sizes]').textContent);
      this.sizes = values.map((v) => ({ label: v, size: parseSize(v) })).filter((s) => s.size);
      if (this.sizes.length < 2) { this.hidden = true; return; }
      this.render();
      this.onChange = (event) => { if (event.target.closest('variant-picker')) this.mark(); };
      document.addEventListener('change', this.onChange);
      this.addEventListener('click', (event) => {
        const box = event.target.closest('[data-size]');
        if (!box) return;
        const input = Array.from(document.querySelectorAll('fieldset[data-option-kind="size"] input'))
          .find((i) => i.value === box.dataset.size);
        if (input) input.click();
      });
    }
    disconnectedCallback() { if (this.onChange) document.removeEventListener('change', this.onChange); }
    render() {
      const H = 200, PERSON_H = 175, PERSON_W = 42, GAP = 18, CENTER = 145;
      let x = PERSON_W + GAP * 1.4;
      const boxes = this.sizes.map((s) => {
        const b = { label: s.label, w: s.size[0], h: s.size[1], x: x };
        x += s.size[0] + GAP;
        return b;
      });
      const W = x - GAP + 6;
      this.stage.style.aspectRatio = W + ' / ' + H;
      this.person.style.width = (PERSON_W / W) * 100 + '%';
      this.person.style.height = (PERSON_H / H) * 100 + '%';
      boxes.forEach((b) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'sizecmp__box';
        el.dataset.size = b.label;
        el.style.left = (b.x / W) * 100 + '%';
        el.style.width = (b.w / W) * 100 + '%';
        el.style.height = (b.h / H) * 100 + '%';
        el.style.bottom = (Math.max(0, CENTER - b.h / 2) / H) * 100 + '%';
        el.innerHTML = '<span>' + b.label.replace(/\s*cm\s*$/i, '') + '</span>';
        el.setAttribute('aria-label', (S.chooseSize || 'Elegir [size]').replace('[size]', b.label));
        this.stage.appendChild(el);
      });
      this.mark();
    }
    mark() {
      const current = selectedOf('size');
      this.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('is-active', b.dataset.size === current));
    }
  }
  if (!customElements.get('size-compare')) customElements.define('size-compare', SizeCompare);

  /* Favourites + recently viewed (stored in this browser) ------------------ */
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ } }
  };
  const FAV = 'arsnoir:favs';
  const RECENT = 'arsnoir:recent';

  function syncFavs() {
    const favs = store.get(FAV);
    document.querySelectorAll('[data-fav]').forEach(function (b) {
      const on = favs.indexOf(b.dataset.fav) !== -1;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? (S.removeFavorite || 'Quitar de favoritos') : (S.saveFavorite || 'Guardar en favoritos'));
    });
    document.querySelectorAll('[data-fav-count]').forEach(function (c) {
      c.textContent = favs.length;
      c.hidden = favs.length === 0;
    });
  }

  document.addEventListener('click', function (event) {
    const b = event.target.closest('[data-fav]');
    if (!b) return;
    event.preventDefault();
    const favs = store.get(FAV);
    const i = favs.indexOf(b.dataset.fav);
    if (i === -1) favs.unshift(b.dataset.fav); else favs.splice(i, 1);
    store.set(FAV, favs.slice(0, 60));
    syncFavs();
    b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
    const grid = b.closest('[data-fav-grid]');
    if (grid && i !== -1) renderFavs();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function cardHtml(p, index) {
    const tones = ['accent', 'dark', 'light'];
    const img = p.featured_image
      ? '<img src="' + p.featured_image + (p.featured_image.indexOf('?') === -1 ? '?' : '&') + 'width=600" alt="' + escapeHtml(p.title) + '" loading="lazy">'
      : '<div class="poster__ph" aria-hidden="true"></div>';
    const idx = ('00' + index).slice(-3);
    return '<li><div class="card-wrap"><a href="' + p.url + '" class="poster poster--' + tones[index % 3] + ' art-card">' +
      '<div class="poster__frame"><div class="poster__media">' + img + '</div>' +
      (p.available ? '' : '<span class="poster__tag">' + escapeHtml(S.soldOut || 'AGOTADA') + '</span>') + '</div>' +
      '<span class="poster__info"><span class="poster__meta"><span class="poster__title"><span class="art-card__index">[' + idx + ']</span> ' + escapeHtml(p.title) + '</span>' +
      '<span class="poster__price">' + (p.price_varies ? (S.from || 'Desde') + ' ' : '') + formatMoney(p.price_min || p.price) + '</span></span>' +
      '<span class="poster__plus" aria-hidden="true">+</span></span></a>' +
      '<button type="button" class="fav-btn" data-fav="' + escapeHtml(p.handle) + '" aria-pressed="false" aria-label="' + escapeHtml(S.saveFavorite || 'Guardar en favoritos') + '">' +
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/></svg>' +
      '</button></div></li>';
  }

  /* Fetch products by handle; forget handles that no longer exist */
  function loadProducts(handles, key) {
    return Promise.all(handles.map(function (h) {
      return fetch(root + 'products/' + encodeURIComponent(h) + '.js')
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    })).then(function (list) {
      const missing = handles.filter(function (h, i) { return !list[i]; });
      if (missing.length && key) store.set(key, store.get(key).filter(function (h) { return missing.indexOf(h) === -1; }));
      return list.filter(Boolean);
    });
  }

  function renderFavs() {
    const grid = document.querySelector('[data-fav-grid]');
    if (!grid) return;
    const empty = document.querySelector('[data-fav-empty]');
    const favs = store.get(FAV);
    if (!favs.length) { grid.innerHTML = ''; if (empty) empty.hidden = false; return; }
    loadProducts(favs, FAV).then(function (products) {
      grid.innerHTML = products.map(function (p, i) { return cardHtml(p, i + 1); }).join('');
      if (empty) empty.hidden = products.length > 0;
      syncFavs();
    });
  }

  (function recentlyViewed() {
    const productRoot = document.querySelector('[data-product-handle]');
    if (productRoot) {
      const handle = productRoot.dataset.productHandle;
      const list = store.get(RECENT).filter(function (h) { return h !== handle; });
      list.unshift(handle);
      store.set(RECENT, list.slice(0, 12));
    }
    document.querySelectorAll('[data-recent]').forEach(function (section) {
      const current = section.dataset.current;
      const handles = store.get(RECENT).filter(function (h) { return h !== current; }).slice(0, parseInt(section.dataset.limit, 10) || 4);
      if (!handles.length) return;
      loadProducts(handles, RECENT).then(function (products) {
        if (!products.length) return;
        section.querySelector('[data-recent-grid]').innerHTML = products.map(function (p, i) { return cardHtml(p, i + 1); }).join('');
        section.hidden = false;
        syncFavs();
      });
    });
  })();

  renderFavs();
  syncFavs();

  /* Cart: "Completa tu pared" recommendations ------------------------------ */
  const upsellCache = {};
  function loadUpsell() {
    document.querySelectorAll('[data-cart-upsell]').forEach(function (box) {
      const id = box.dataset.productId;
      if (!id) return;
      if (upsellCache[id]) { box.innerHTML = upsellCache[id]; return; }
      fetch(root + 'recommendations/products?product_id=' + id + '&limit=8&section_id=cart-upsell')
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (text) {
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const el = doc.querySelector('.upsell');
          upsellCache[id] = el ? el.outerHTML : '';
          box.innerHTML = upsellCache[id];
        })
        .catch(function () {});
    });
  }
  loadUpsell();
  const drawerEl = drawer();
  if (drawerEl && window.MutationObserver) {
    new MutationObserver(function () {
      const box = drawerEl.querySelector('[data-cart-upsell]');
      if (box && !box.innerHTML.trim()) { Object.keys(upsellCache).forEach(function (k) { delete upsellCache[k]; }); loadUpsell(); }
    }).observe(drawerEl, { childList: true, subtree: true });
  }

  /* Cart: "Es un regalo" saved as you type -------------------------------- */
  let giftTimer = null;
  function saveGift(from) {
    const box = from.closest('[data-gift]');
    const toggle = box.querySelector('[data-gift-toggle]');
    const note = box.querySelector('[data-gift-note]');
    clearTimeout(giftTimer);
    giftTimer = setTimeout(function () {
      fetch(root + 'cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ attributes: { Regalo: toggle.checked ? 'Sí' : '' }, note: toggle.checked ? note.value : '' })
      });
    }, 400);
  }
  document.addEventListener('change', function (event) { if (event.target.closest('[data-gift]')) saveGift(event.target); });
  document.addEventListener('input', function (event) { if (event.target.matches('[data-gift-note]')) saveGift(event.target); });

  /* On load: bring the gift line up to date (e.g. after a discount change at checkout) */
  if (drawer() && cartConfig() && (cartConfig() || {}).giftVariant) {
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
