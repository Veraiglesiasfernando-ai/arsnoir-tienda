/* Live size preview: draws the artwork to scale over a 200 cm sofa, in the chosen frame. */
(function () {
  const picker = document.querySelector('variant-picker');
  if (!picker) return;
  document.querySelectorAll('[data-size-visual]').forEach(function (box) { init(box); });

  /* Desktop: dock the big wall over the left column while the picker is on screen */
  const big = document.querySelector('.svis--big');
  const gallery = big && big.closest('.product__gallery');
  if (big && gallery && 'IntersectionObserver' in window) {
    const place = function () {
      const r = gallery.getBoundingClientRect();
      big.style.setProperty('--sv-left', r.left + 'px');
      big.style.setProperty('--sv-width', r.width + 'px');
    };
    place();
    window.addEventListener('resize', place);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        place();
        big.classList.toggle('is-docked', en.isIntersecting && window.innerWidth >= 990);
      });
    }, { rootMargin: '-35% 0px -35% 0px' }).observe(picker);
  }
  function init(box) {
  const art = box.querySelector('[data-svis-art]');
  const frame = box.querySelector('[data-svis-frame]');
  const img = box.querySelector('[data-svis-img]');
  const dims = box.querySelector('[data-svis-dims]');
  const wLab = box.querySelector('[data-svis-w]');
  const hLab = box.querySelector('[data-svis-h]');
  const WALL_CM = 320; /* wall width shown */
  const fmt = function (n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); };

  const read = function () {
    let size = null, finish = '';
    picker.querySelectorAll('fieldset').forEach(function (fs) {
      const c = fs.querySelector('input:checked');
      if (!c) return;
      const t = (c.dataset.display || c.value || '');
      const m = t.replace(/\(|\)/g, ' ').match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/i);
      if (m && !size) size = [parseFloat(m[1].replace(',', '.')), parseFloat(m[2].replace(',', '.'))];
      else finish += ' ' + t;
    });
    const fin = picker.querySelector('[data-finish-value]');
    if (fin) finish += ' ' + fin.textContent;
    return { size: size, finish: finish.toLowerCase() };
  };

  const update = function () {
    const r = read();
    if (!r.size) { box.hidden = true; return; }
    box.hidden = false;
    let w = Math.min(r.size[0], r.size[1]), h = Math.max(r.size[0], r.size[1]);
    const canvas = /lienzo|canvas/.test(r.finish);
    let kind = 'none';
    if (/negro|black/.test(r.finish)) kind = 'black';
    else if (/blanco|white/.test(r.finish)) kind = 'white';
    else if (/madera|wood|oak|roble/.test(r.finish)) kind = 'wood';
    if (/sin marco/.test(r.finish)) kind = 'none';
    frame.dataset.kind = kind;
    frame.classList.toggle('is-canvas', canvas);
    const fw = kind === 'none' ? 0 : 2.2; /* frame moulding, cm */
    art.style.setProperty('--w', ((w + fw * 2) / WALL_CM * 100) + '%');
    art.style.setProperty('--ratio', (w + fw * 2) + ' / ' + (h + fw * 2));
    art.style.setProperty('--fw', (fw / (w + fw * 2) * 100) + '%');
    const txt = fmt(w) + ' × ' + fmt(h) + ' cm';
    dims.textContent = txt + (kind !== 'none' ? (canvas ? ' · lienzo con marco' : ' · con marco') : (canvas ? ' · lienzo' : ''));
    wLab.textContent = fmt(w + fw * 2) + ' cm';
    hLab.textContent = fmt(h + fw * 2) + ' cm';
    box.classList.remove('is-bump'); void box.offsetWidth; box.classList.add('is-bump');
  };

  picker.addEventListener('change', function () { setTimeout(update, 0); });
  picker.addEventListener('click', function (e) { if (e.target.closest('.ftile, button')) setTimeout(update, 30); });
  update();

  /* Once the customer has a preview of their own, show it on the wall */
  const live = document.querySelector('.tlive__art');
  if (live && img && 'MutationObserver' in window) {
    new MutationObserver(function () {
      if (live.src && /^https?:/.test(live.src)) {
        img.removeAttribute('srcset'); img.src = live.src;
        box.classList.add('is-preview');
        const t = box.querySelector('[data-svis-title]');
        if (t) t.innerHTML = 'Tu obra,<br>en tu pared.';
      }
    }).observe(live, { attributes: true, attributeFilter: ['src'] });
  }
  }
})();
