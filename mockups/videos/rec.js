// node rec.js <name> — renders demo.html frame by frame and encodes an MP4
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const A = path.join(__dirname, 'a');
const IL = (o) => Object.assign({ mode: 'il', T: { s1a: 1.6, s1b: 2.8, tapUp: 3.2, sheet: 3.4, photo: 4.5, s2a: 4.8, s2b: 5.6, type: 5.0, go: 6.8, top: 7.0, load: 7.4, reveal: 11.4, after: 13.4, con: 15.0, size: 16.0, add: 17.0, cart: 17.3, end: 20.3 }, dur: 22.6, size: '30×40 cm — 44,95 €', price: '44,95 €' }, o);
const CFGS = {
  pareja: IL({ title: 'Retrato de pareja en acuarela', ex: 'ej-pareja.jpg', photo: 'pareja.jpg', result: 'res-pareja.jpg', name: 'Álex & Sara', nameLabel: 'Vuestros nombres',
    variant: 'Lámina · 30×40 cm · Marco negro', end: 'Sube vuestra foto.<br>La veis gratis antes de pagar.',
    caps: [[0, 1.6, 1, 'Elige tu estilo'], [1.7, 4.9, 2, 'Sube vuestra foto'], [4.9, 6.9, 3, 'Escribe vuestros nombres'], [7.4, 13.2, 4, 'La veis gratis antes de pagar'], [13.6, 17.2, 5, 'Elige tamaño y marco'], [17.4, 20.2, 6, 'Al carrito, lista para pedir']] }),
  mascota: IL({ title: 'Retrato cómic', ex: 'ej-perro.jpg', photo: 'perro.jpg', result: 'res-perro.jpg', name: 'Nube', nameLabel: 'Su nombre (sale en la chapa)',
    variant: 'Lámina · 30×40 cm · Marco negro', end: 'Sube su foto.<br>Lo ves gratis antes de pagar.',
    caps: [[0, 1.6, 1, 'Elige su estilo'], [1.7, 4.9, 2, 'Sube su foto'], [4.9, 6.9, 3, 'Escribe su nombre'], [7.4, 13.2, 4, 'Lo ves gratis antes de pagar'], [13.6, 17.2, 5, 'Elige tamaño y marco'], [17.4, 20.2, 6, 'Al carrito, listo para pedir']] }),
  foto: { mode: 'foto', title: 'Tu foto, en un cuadro', eyebrow: 'ARSNOIR · CON TU FOTO', ex: 'ej-foto.jpg', photo: 'familia.jpg', result: 'familia.jpg',
    T: { s1a: 1.2, s1b: 2.2, tapUp: 2.6, sheet: 2.8, photo: 3.9, top: 4.1, wall: 4.4, after: 6.8, con: 8.2, size: 9.2, add: 10.2, cart: 10.5, end: 13.2 }, dur: 15.4,
    size: '30×40 cm — 44,95 €', price: '44,95 €', variant: 'Póster · 30×40 cm · Marco negro', end: 'Tu foto favorita,<br>en un cuadro para tu pared.',
    caps: [[0, 4.2, 1, 'Sube tu foto'], [4.4, 6.8, 2, 'La ves en tu pared'], [7.0, 10.4, 3, 'Elige tamaño y marco'], [10.6, 13.1, 4, 'Al carrito, lista para pedir']] }
};
(async () => {
  const name = process.argv[2], C = CFGS[name], FPS = 30;
  const out = path.join(__dirname, 'frames-' + name); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.addInitScript(c => { window.CFG = c; }, C);
  await p.goto('file://' + path.join(A, 'demo.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const n = Math.round(C.dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.render(t), i / FPS);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 88 });
  }
  await b.close();
  execSync(`ffmpeg -loglevel error -y -framerate ${FPS} -i ${out}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart ${path.join(__dirname, 'arsnoir-como-funciona-' + name + '.mp4')}`);
  console.log('ok', name, n);
})();
