/* «Verlo en mi pared»: the chosen size and finish as a real-size 3D frame (GLB), placed on the wall
   in augmented reality with <model-viewer> (WebXR on Android, Quick Look on iPhone). No camera code
   of ours: the phone's own AR keeps the frame straight and fixed on the wall.
   window.ArsnoirWallAR.build({ w, h, kind, image }) → Promise<Blob>   (w, h in cm; kind: black|white|wood|none|canvas) */
(function () {
  if (window.ArsnoirWallAR) return;

  const COLORS = { black: [0.06, 0.06, 0.06, 1], white: [0.93, 0.92, 0.9, 1], wood: [0.42, 0.28, 0.16, 1], none: [0.97, 0.97, 0.96, 1], canvas: [0.16, 0.16, 0.16, 1] };

  /* Artwork cropped to the print's proportions, as JPEG bytes */
  function artBytes(image, w, h) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        const long = 1600;
        const cw = w >= h ? long : Math.round(long * w / h);
        const ch = w >= h ? Math.round(long * h / w) : long;
        const c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        const k = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const dw = img.naturalWidth * k, dh = img.naturalHeight * k;
        c.getContext('2d').drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        c.toBlob(function (b) {
          if (!b) return reject(new Error('image'));
          b.arrayBuffer().then(function (a) { resolve(new Uint8Array(a)); }, reject);
        }, 'image/jpeg', 0.9);
      };
      img.onerror = function () { reject(new Error('image')); };
      img.src = image;
    });
  }

  /* Box from (x0,y0,z0) to (x1,y1,z1): 24 vertices with flat normals */
  function box(x0, y0, z0, x1, y1, z1) {
    const f = [
      [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]],
      [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1]],
      [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]],
      [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0]],
      [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0]],
      [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]]
    ];
    const pos = [], nor = [], idx = [];
    f.forEach(function (face, i) {
      for (let v = 0; v < 4; v++) { pos.push.apply(pos, face[v]); nor.push.apply(nor, face[4]); }
      const b = i * 4;
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    });
    return { pos: pos, nor: nor, idx: idx };
  }

  function build(opts) {
    const w = opts.w / 100, h = opts.h / 100;
    const kind = COLORS[opts.kind] ? opts.kind : 'none';
    const framed = kind === 'black' || kind === 'white' || kind === 'wood';
    const fw = framed ? 0.025 : 0;
    const depth = kind === 'canvas' ? 0.035 : framed ? 0.025 : 0.003;
    const W = w + 2 * fw, H = h + 2 * fw;
    return artBytes(opts.image, opts.w, opts.h).then(function (jpg) {
      /* Back of the frame on the wall (z = 0), front facing +Z, centred */
      const body = box(-W / 2, -H / 2, 0, W / 2, H / 2, depth);
      const z = depth + 0.0008;
      const art = {
        pos: [-w / 2, -h / 2, z, w / 2, -h / 2, z, w / 2, h / 2, z, -w / 2, h / 2, z],
        nor: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        uv: [0, 1, 1, 1, 1, 0, 0, 0],
        idx: [0, 1, 2, 0, 2, 3]
      };

      const parts = [];
      const views = [];
      const accessors = [];
      let offset = 0;
      const add = function (typed, target) {
        const bytes = new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength);
        const pad = (4 - (bytes.length % 4)) % 4;
        parts.push(bytes);
        if (pad) parts.push(new Uint8Array(pad));
        const view = { buffer: 0, byteOffset: offset, byteLength: bytes.length };
        if (target) view.target = target;
        views.push(view);
        offset += bytes.length + pad;
        return views.length - 1;
      };
      const acc = function (arr, type, isIndex) {
        const typed = isIndex ? new Uint16Array(arr) : new Float32Array(arr);
        const view = add(typed, isIndex ? 34963 : 34962);
        const n = type === 'VEC3' ? 3 : type === 'VEC2' ? 2 : 1;
        const a = { bufferView: view, componentType: isIndex ? 5123 : 5126, count: arr.length / n, type: type };
        if (type === 'VEC3' && !isIndex) {
          const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
          for (let i = 0; i < arr.length; i += 3) for (let j = 0; j < 3; j++) { min[j] = Math.min(min[j], arr[i + j]); max[j] = Math.max(max[j], arr[i + j]); }
          a.min = min; a.max = max;
        }
        accessors.push(a);
        return accessors.length - 1;
      };
      const bPos = acc(body.pos, 'VEC3'), bNor = acc(body.nor, 'VEC3'), bIdx = acc(body.idx, 'SCALAR', true);
      const aPos = acc(art.pos, 'VEC3'), aNor = acc(art.nor, 'VEC3'), aUv = acc(art.uv, 'VEC2'), aIdx = acc(art.idx, 'SCALAR', true);
      const imgView = add(jpg);

      const json = {
        asset: { version: '2.0', generator: 'ARSNOIR wall-ar' },
        scene: 0,
        scenes: [{ nodes: [0, 1] }],
        nodes: [{ mesh: 0, name: 'frame' }, { mesh: 1, name: 'artwork' }],
        meshes: [
          { primitives: [{ attributes: { POSITION: bPos, NORMAL: bNor }, indices: bIdx, material: 0 }] },
          { primitives: [{ attributes: { POSITION: aPos, NORMAL: aNor, TEXCOORD_0: aUv }, indices: aIdx, material: 1 }] }
        ],
        materials: [
          { name: 'frame', pbrMetallicRoughness: { baseColorFactor: COLORS[kind], metallicFactor: 0, roughnessFactor: kind === 'black' ? 0.5 : 0.75 } },
          { name: 'print', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.9 } }
        ],
        textures: [{ sampler: 0, source: 0 }],
        samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
        images: [{ bufferView: imgView, mimeType: 'image/jpeg' }],
        accessors: accessors,
        bufferViews: views,
        buffers: [{ byteLength: offset }]
      };

      let jsonText = JSON.stringify(json);
      while (jsonText.length % 4) jsonText += ' ';
      const jsonBytes = new TextEncoder().encode(jsonText);
      const total = 12 + 8 + jsonBytes.length + 8 + offset;
      const out = new Uint8Array(total);
      const dv = new DataView(out.buffer);
      dv.setUint32(0, 0x46546c67, true); dv.setUint32(4, 2, true); dv.setUint32(8, total, true);
      dv.setUint32(12, jsonBytes.length, true); dv.setUint32(16, 0x4e4f534a, true);
      out.set(jsonBytes, 20);
      let p = 20 + jsonBytes.length;
      dv.setUint32(p, offset, true); dv.setUint32(p + 4, 0x004e4942, true);
      p += 8;
      parts.forEach(function (part) { out.set(part, p); p += part.length; });
      return new Blob([out], { type: 'model/gltf-binary' });
    });
  }

  /* <model-viewer> is only loaded the first time someone opens the wall view */
  let loading = null;
  function loadViewer() {
    if (window.customElements && customElements.get('model-viewer')) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.4.0/dist/model-viewer.min.js';
      s.onload = function () { customElements.whenDefined('model-viewer').then(resolve); };
      s.onerror = function () { loading = null; reject(new Error('viewer')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  window.ArsnoirWallAR = { build: build, loadViewer: loadViewer };
})();
