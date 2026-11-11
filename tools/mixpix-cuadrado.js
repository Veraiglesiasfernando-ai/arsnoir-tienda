// Prepara el archivo de un MIXPIX (cuadrado de 20×20) a partir del retrato vertical, sin cortar nada importante.
// 1. Detecta el color de fondo (el color más habitual en los bordes) y la zona con dibujo (mascota, nombre…).
// 2. Si el dibujo cabe en un cuadrado del ancho de la imagen, o si ya se sale por un borde (cuerpo cortado
//    por el marco: cómic, glam, óleo…), recorta un cuadrado: centrado en el dibujo, o pegado a su parte de
//    arriba (cabeza y nombre) si no cabe. Así no aparece ningún corte nuevo.
// 3. Si no cabe (p. ej. nombre arriba y cuerpo abajo), hace el cuadrado más grande que lo incluye y rellena
//    con el color de fondo (en fondos lisos, como la acuarela, el relleno no se nota).
// Uso: node tools/mixpix-cuadrado.js entrada.(png|jpg) salida.png [lado=2400]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [src, out, sideArg] = process.argv.slice(2);
  if (!src || !out) { console.error('Uso: node tools/mixpix-cuadrado.js entrada.png salida.png [lado]'); process.exit(1); }
  const side = parseInt(sideArg || '2400', 10);
  const data = fs.readFileSync(src).toString('base64');
  const type = /\.jpe?g$/i.test(src) ? 'jpeg' : 'png';
  const b = await chromium.launch(); const p = await b.newPage();
  const res = await p.evaluate(async ({ data, type, side }) => {
    const img = new Image(); img.src = `data:image/${type};base64,${data}`; await img.decode();
    const W = img.width, H = img.height;
    const t = document.createElement('canvas'); t.width = W; t.height = H;
    const tx = t.getContext('2d'); tx.drawImage(img, 0, 0);
    const px = tx.getImageData(0, 0, W, H).data;
    // Background: most common colour on the four edges
    const bins = {};
    const add = (x, y) => { const i = (y * W + x) * 4; const k = (px[i] >> 4) + ',' + (px[i + 1] >> 4) + ',' + (px[i + 2] >> 4); const e = bins[k] || (bins[k] = [0, 0, 0, 0]); e[0] += px[i]; e[1] += px[i + 1]; e[2] += px[i + 2]; e[3]++; };
    for (let x = 0; x < W; x += 2) { add(x, 2); add(x, H - 3); }
    for (let y = 0; y < H; y += 2) { add(2, y); add(W - 3, y); }
    const top = Object.values(bins).sort((a, c) => c[3] - a[3])[0];
    const bg = [top[0] / top[3], top[1] / top[3], top[2] / top[3]];
    // Drawing: rows/columns with enough pixels clearly different from the background
    const diff = (i) => Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 60;
    const rows = new Array(H).fill(0), cols = new Array(W).fill(0);
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (diff((y * W + x) * 4)) { rows[y]++; cols[x]++; }
    const thrR = W / 2 * 0.01, thrC = H / 2 * 0.01;
    let y0 = 0, y1 = H - 1, x0 = 0, x1 = W - 1;
    while (y0 < H - 1 && rows[y0] <= thrR) y0++;
    while (y1 > y0 && rows[y1] <= thrR) y1--;
    while (x0 < W - 1 && cols[x0] <= thrC) x0++;
    while (x1 > x0 && cols[x1] <= thrC) x1--;
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    const c = document.createElement('canvas'); c.width = c.height = side; const x = c.getContext('2d');
    x.fillStyle = `rgb(${bg[0] | 0},${bg[1] | 0},${bg[2] | 0})`; x.fillRect(0, 0, side, side);
    let mode, sx, sy, s;
    const sMin = Math.min(W, H);
    // Drawing that runs off the image (body cut by the frame) cannot be padded without showing the cut
    const bleeds = x0 <= 4 || y0 <= 4 || x1 >= W - 5 || y1 >= H - 5;
    if (Math.max(bw, bh) <= sMin || bleeds) {
      // Crop: a square of the image's short side, kept inside the image. Centred on the drawing when it fits;
      // when it doesn't, anchored to its top (head and name) and the bottom is cut, where it already ran off.
      mode = 'recorte'; s = sMin;
      sx = Math.min(Math.max((x0 + x1) / 2 - s / 2, 0), W - s);
      const syc = bh <= s ? (y0 + y1) / 2 - s / 2 : y0 - s * 0.03;
      sy = Math.min(Math.max(syc, 0), H - s);
      x.drawImage(img, sx, sy, s, s, 0, 0, side, side);
    } else {
      // Pad: the smallest square holding the whole drawing (+3 % air), filled with the background colour
      mode = 'relleno'; s = Math.max(bw, bh) * 1.03;
      sx = (x0 + x1) / 2 - s / 2; sy = (y0 + y1) / 2 - s / 2;
      const k = side / s;
      x.drawImage(img, -sx * k, -sy * k, W * k, H * k);
    }
    return { url: c.toDataURL('image/png'), mode, box: [x0, y0, x1, y1], size: [W, H] };
  }, { data, type, side });
  fs.writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
  await b.close();
  console.log(`Listo (${res.mode}): ${out} · dibujo ${res.box.join(',')} en ${res.size.join('×')}`);
})();
