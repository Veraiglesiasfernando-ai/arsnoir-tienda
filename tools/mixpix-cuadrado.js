// Prepara el archivo de un MIXPIX (20×20): pone el retrato vertical entero y centrado en un cuadrado
// de 2400×2400 px, rellenando los lados con el color de fondo del retrato. No recorta nada.
// Uso: node tools/mixpix-cuadrado.js retrato.png salida.png
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [src, out] = process.argv.slice(2);
  if (!src || !out) { console.error('Uso: node tools/mixpix-cuadrado.js entrada.png salida.png'); process.exit(1); }
  const data = fs.readFileSync(src).toString('base64');
  const type = /\.jpe?g$/i.test(src) ? 'jpeg' : 'png';
  const b = await chromium.launch(); const p = await b.newPage();
  const url = await p.evaluate(async ({ data, type }) => {
    const img = new Image(); img.src = `data:image/${type};base64,${data}`; await img.decode();
    const S = 2400, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d');
    // Sides: the most common colour on the portrait's left/right edges (its background), as a flat fill
    const t = document.createElement('canvas'); t.width = img.width; t.height = img.height;
    const tx = t.getContext('2d'); tx.drawImage(img, 0, 0);
    const bins = {};
    for (const col of [1, 4, img.width - 5, img.width - 2]) {
      const d = tx.getImageData(col, 0, 1, img.height).data;
      for (let i = 0; i < d.length; i += 4) {
        const key = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4);
        const e = bins[key] || (bins[key] = [0, 0, 0, 0]);
        e[0] += d[i]; e[1] += d[i + 1]; e[2] += d[i + 2]; e[3]++;
      }
    }
    const top = Object.values(bins).sort((p, q) => q[3] - p[3])[0];
    x.fillStyle = `rgb(${top[0] / top[3] | 0},${top[1] / top[3] | 0},${top[2] / top[3] | 0})`;
    x.fillRect(0, 0, S, S);
    const k = Math.min(S / img.width, S / img.height), w = img.width * k, h = img.height * k;
    x.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
    return c.toDataURL('image/png');
  }, { data, type });
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  await b.close(); console.log('Listo:', out);
})();
