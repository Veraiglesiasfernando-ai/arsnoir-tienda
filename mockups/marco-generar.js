/* «<NAME> con marco negro» product photo: the artwork in a black frame with a white mat on a soft wall.
   node mockups/marco-generar.js <art.jpg> <out.png> */
const {chromium} = require('playwright');
const fs = require('fs');
(async () => {
  const [art, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  const data = 'data:image/jpeg;base64,' + fs.readFileSync(art).toString('base64');
  const url = await p.evaluate(async (src) => {
    const im = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const W = 1600, H = 2000, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#f3f0eb'); bg.addColorStop(1, '#e9e5de'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const fw = 1040, fh = 1300, fx = (W - fw) / 2, fy = (H - fh) / 2 - 20;
    g.save(); g.shadowColor = 'rgba(0,0,0,0.28)'; g.shadowBlur = 50; g.shadowOffsetY = 26; g.fillStyle = '#151515'; g.fillRect(fx, fy, fw, fh); g.restore();
    const t = 34; g.fillStyle = '#fbfaf7'; g.fillRect(fx + t, fy + t, fw - 2 * t, fh - 2 * t);
    const m = 70, ax = fx + t + m, ay = fy + t + m, aw = fw - 2 * (t + m), ah = fh - 2 * (t + m);
    const k = Math.max(aw / im.naturalWidth, ah / im.naturalHeight), sw = aw / k, sh = ah / k;
    g.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, ax, ay, aw, ah);
    const s = g.createLinearGradient(0, fy + t, 0, fy + t + 18); s.addColorStop(0, 'rgba(0,0,0,0.18)'); s.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = s; g.fillRect(fx + t, fy + t, fw - 2 * t, 18);
    return c.toDataURL('image/png');
  }, data);
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  await b.close();
})();
