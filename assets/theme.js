/* ARS NOIR — theme scripts (no dependencies) */

(function () {
  const lang = document.documentElement.lang || 'es';
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
        b.textContent = variant.available ? 'Añadir' : button.dataset.soldOutText;
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

  function closeDrawer() {
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
      link.setAttribute('aria-label', 'Carrito, ' + count + ' artículos');
    });
  }

  function refreshDrawer() {
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
      .then(function (cart) { updateCount(cart.item_count); });
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
        if (!res.ok) { alert(res.body.description || 'No se ha podido añadir al carrito.'); return; }
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

  if (!customElements.get('variant-picker')) customElements.define('variant-picker', VariantPicker);
})();
