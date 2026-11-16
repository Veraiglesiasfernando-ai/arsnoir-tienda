/**
 * Illustration templates. The key is the "Plantilla" id set in the product's template-studio block.
 * - reference: the template image Replicate copies the style from (second image; first with refFirst).
 * - refFirst: the model edits the template and swaps in the customer's pet (keeps pose and style better).
 * - prompt: what to do with the customer's photo (first image). {NAME} is replaced with the name.
 * Prompts are fixed here on purpose: customers can't send their own prompts.
 */
export const TEMPLATES = {
  'retrato-nombre': {
    needsName: true,
    font: 'moderna',
    colors: { crema: 'warm off-white', rosa: 'soft pastel pink', azul: 'pale powder blue', verde: 'soft sage green', arena: 'warm sand beige' },
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new portrait painting of the pet from the first image in exactly the same style as the second image: ' +
      'thick impasto oil paint with visible palette-knife and brush strokes, plain {COLOR} background, ' +
      'the animal facing forward and centred, framed from the chest up, happy expression. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. No clothes or accessories. ' +
      'Write the name "{NAME}" small in {FONT}, in black, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'retrato-sudadera': {
    needsName: true,
    font: 'pincel',
    colors: { rosa: 'pink', azul: 'blue', verde: 'sage green', amarillo: 'butter yellow', lila: 'lilac' },
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-retrato-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new portrait illustration of the pet from the first image in exactly the same style as the second image: ' +
      'flat hand-painted illustration with soft brush texture, plain pastel {COLOR} background, the animal facing forward, ' +
      'happy expression, wearing a {COLOR} hoodie in a slightly deeper shade than the background, with white drawstrings, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'Write the name "{NAME}" large, in {FONT}, in white, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'oleo-vintage': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-oleo.jpg',
    prompt:
      'The first image is the finished artwork template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same vintage oil painting look with visible textured brushstrokes on every part, the same vertical pale blue and cream striped background, ' +
      'the same cream headscarf with small blue flowers tied under the chin, the same pose, head tilt, angle, size and chest-up framing. ' +
      'The pet must be fully repainted in oil brushstrokes like the rest of the painting: never keep photographic pixels, photo fur texture, photo lighting or anything of the photo background (bed, sheets, room). Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },

  'en-su-rincon': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-en-casa.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal and the scene, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new painting of the pet from the first image in exactly the same style as the second image: ' +
      'textured painterly brushwork, the pet lying relaxed on a soft pale blue sofa with its head resting on a blue cushion, ' +
      'plain warm off-white wall behind, calm cosy mood, looking at the viewer. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'retrato-pastel': {
    needsName: false,
    colors: { azul: 'soft pastel sky blue', rosa: 'soft pastel pink', verde: 'soft pastel mint green', amarillo: 'soft pastel butter yellow', lila: 'soft pastel lilac', melocoton: 'soft pastel peach' },
    aspectRatio: '3:4',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-retrato-pastel.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, breed, markings or face. ' +
      'It must be a completely new hand-made artwork in the style of the second image: repaint every part of the animal, never keep or paste photographic pixels, photo fur texture or the photo background. Exactly one animal with one head. Use the same pose, angle and framing as the animal in the second image, even if the photo shows the pet from the side, from above or lying down: redraw it in that pose. ' +
      'Create a new realistic portrait painting of the pet from the first image in exactly the same style as the second image: ' +
      'detailed digital painting with fine directional brush strokes following the fur, soft even studio light, rich natural colours, glossy expressive eyes, ' +
      'the animal facing forward, head slightly tilted, happy expression, framed from the chest up, centred, the head in the upper half, ' +
      'on a completely plain flat {COLOR} background with no gradient, no shadow, no objects. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every spot and marking and eye colour. No clothes or accessories. ' +
      'No text, no logos, no border. Vertical 3:4.'
  },
  'ilustracion-plana': {
    needsName: false,
    colors: { gris: 'light grey', rosa: 'soft pastel pink', azul: 'pale powder blue', verde: 'soft sage green', amarillo: 'soft butter yellow' },
    aspectRatio: '3:4',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-plana.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same clean flat vector style with crisp cel-shaded fur in a few flat tones, smooth shapes and fine whisker lines, the same thin white sticker outline around the animal, ' +
      'the same close-up portrait framing as the template: only the head and the top of the chest, the head large and filling the upper two thirds of the picture, cropped at the chest. No legs, no paws, no full body. ' +
      'The head faces the viewer, looking at the viewer, like the template animal. Background: plain flat {COLOR}. ' +
      'Do not copy the pose, lying position, framing or angle of the photo. ' +
      'The pet must be fully redrawn as flat vector shapes: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head and two ears. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 3:4.'
  },

  'navidad-verde': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-navidad-verde.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same painterly digital illustration style, the same lime-green shaggy furry hood with a long tuft on top around the head, the same lime-green shaggy furry collar covering the shoulders and chest, ' +
      'the same red satin bow under the chin, the same flat pale sky-blue background with round white snow dots, the same pose, angle, size and head-and-chest framing. ' +
      'The pet\'s ears stick out of the hood like in the template if it has them. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'navidad-papa-noel': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-navidad-papa-noel.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same clean digital illustration style with soft painted fur, the same red Santa hat with white fluffy trim and pompom worn tilted on the head, ' +
      'the same red and white striped candy cane held sideways in the mouth, the same flat pale sky-blue background with round white snow dots, the same pose, angle, size and head-and-chest framing, looking at the viewer. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'navidad-gorro-lapiz': {
    needsName: false,
    aspectRatio: '3:4',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-navidad-gorro-lapiz.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same hand-drawn coloured-pencil and crayon style with loose scribbled strokes and soft textured shading, the same red Santa hat with fluffy white scribbled trim and pompom worn slightly tilted on the head, ' +
      'the same plain white background, the same head-and-chest framing fading out at the bottom in loose strokes, the same pose and angle, looking at the viewer. ' +
      'The pet must be fully redrawn in coloured pencil: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 3:4.'
  },
  'navidad-pareja-corona': {
    needsName: false,
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-navidad-pareja-corona.jpg',
    prompt:
      'The first image is the finished Christmas illustration template. The second image is the customer\'s photo. ' +
      'Edit the first image: replace the two people with the people from the second image and keep everything else of the first image exactly as it is: ' +
      'the same flat textured gouache-style illustration with soft grain, the same round green Christmas wreath with holly, red berries, yellow stars and white flowers, the same big red and white striped bow on top, ' +
      'the same red ribbon banner across the bottom with the words "Merry Christmas" in the same cream lettering, the same plain warm cream paper background, the same head-and-shoulders framing inside the wreath. ' +
      'Dress the people in cosy patterned Christmas jumpers like in the template. Draw them in the same simple cute style: round faces, small dot eyes, rosy freckled cheeks, gentle smiles. ' +
      'Keep every person from the second image recognisable: face shape, hair colour, length and style, beard and skin tone. Draw glasses, earrings or other accessories only if that person wears them in the photo; never add any. Draw exactly the same number of people as in the photo: never invent or remove anyone. Leave out objects and background from the photo. ' +
      'Everything drawn, nothing photographic. No other text, no brand logos, no border. Vertical 4:5.'
  },
  'navidad-pareja-perro': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-navidad-pareja-perro.jpg',
    prompt:
      'The first image is the customer\'s photo: these are the only people and the only pet to paint. The second image only shows the style and the Christmas decoration: none of its people, faces, hairstyles, beards, clothes or its dog may appear. ' +
      'Paint a brand-new Christmas watercolour of the people and the pet from the first image in the style of the second image: loose hand-painted watercolour on textured paper with soft washes and visible brush strokes, warm illustrated faces with rosy freckled cheeks and gentle smiles. ' +
      'Use the same decoration as the second image: soft pink background with a deeper pink round wash behind them, a garland of warm fairy lights across the top with small bows, little snowflakes, laurel branches with red berries around the bottom and a red ribbon bow at the bottom centre. ' +
      'Keep the composition of the photo: the same people and pet in the same positions, close together, head-and-shoulders, centred, with a little space around the edges. ' +
      'They must be instantly recognisable to their owners: each person\'s real face shape, hairstyle, hair length, texture and colour (straight hair stays straight, short stays short), beard or stubble exactly as in the photo, eye colour, skin tone and clothes; the pet\'s breed or mix, head shape, ears, fur colours and markings. ' +
      'Draw glasses, earrings or other accessories only if that person wears them in the photo; never add any. Draw exactly the same people and animals as in the photo: never invent anyone; if there is no animal in the photo, draw no animal and do not put another person in its place. Leave out the photo background and objects. ' +
      'Everything painted with a brush, nothing photographic. No text, no logos, no border. Vertical 4:5.'
  },
  'mascota-lazo-nombre': {
    needsName: true,
    font: 'manuscrita',
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascota-lazo-nombre.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same soft textured gouache and coloured-pencil painting style, the same pink and pale pink vertical stripes background, the same cream scalloped label with little red dots and red hand-drawn outline, ' +
      'the same big red bow on top with its ribbons running down both sides, the same head-only portrait centred inside the label, looking at the viewer. ' +
      'The pet must be fully repainted in the same textured painterly style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'Replace the name under the portrait: write exactly "{NAME}" (letter by letter: {SPELL}) in the same red flowing handwritten script with the same little dashes on both sides. Never copy the template\'s name. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'pareja-mascota-bn': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-pareja-mascota-bn.jpg',
    prompt:
      'The first image is the customer\'s photo: these are the only people and the only pet to paint. The second image only shows the style: none of its people, faces, hairstyles, beards, clothes or its dog may appear. ' +
      'Paint a brand-new portrait of the people and the pet from the first image in the style of the second image: realistic black-and-white graphite and charcoal drawing with soft grey washes and fine detailed shading, ' +
      'fading out at the edges into loose grey watercolour strokes, on a soft pink watercolour background with irregular darker pink patches. Only the background is pink; the people and the pet are in black, white and grey. ' +
      'Keep the composition of the photo: the same people and pet in the same positions, close together, head-and-shoulders, centred, with a little space around the edges. ' +
      'They must be instantly recognisable to their owners: each person\'s real face shape, expression, hairstyle, hair length and texture, beard or stubble exactly as in the photo, and clothes; the pet\'s breed or mix, head shape, ears, fur and markings. ' +
      'Draw glasses, earrings or other accessories only if that person wears them in the photo; never add any. Draw exactly the same people and animals as in the photo: never invent anyone; if there is no animal in the photo, draw no animal and do not put another person in its place. Leave out the photo background and objects. ' +
      'It must look hand-drawn, never like a filtered photo. No text, no logos, no border. Vertical 4:5.'
  },
  'retrato-glam': {
    needsName: true,
    font: 'manuscrita', /* keeps the name as typed («Thor», not «THOR») on the tag */
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-glam.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same flat hand-painted illustration style with soft paper texture, the same plain pastel pink background, ' +
      'the same pink cat-eye sunglasses with tinted pink lenses and little star details, worn on the pet\'s face over the eyes and tilted like in the template, ' +
      'the same pink leather collar with a silver buckle and a red heart-shaped tag hanging from it, the same pose, angle, size and head-and-chest framing, happy expression. ' +
      'The heart tag shows the name "{NAME}" in white, spelled exactly, with a small white star under it. No other text. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No logos, no border. Vertical 4:5.'
  },
  'retrato-comic': {
    needsName: true,
    font: 'manuscrita',
    colors: { azul: 'bright blue', rojo: 'bright red', rosa: 'hot pink', verde: 'green', negro: 'black', morado: 'purple' },
    aspectRatio: '4:5',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-comic.jpg',
    prompt:
      'The first image is the finished illustration template. The second image is the customer\'s photo of their pet. ' +
      'Edit the first image: replace its animal with the pet from the second image and keep everything else of the first image exactly as it is: ' +
      'the same cheerful hand-drawn comic illustration style with fine ink outlines and textured colour, the same plain mustard yellow background with the same little white stars, dots and motion lines, ' +
      'the same tilted head leaning into the picture from the left, the same big happy open-mouth smile with the tongue out, looking at the viewer, the same framing. ' +
      'The collar is {COLOR} leather with stitching and a gold ring, with a red heart-shaped tag hanging from it. ' +
      'The heart tag shows the name "{NAME}" in white, spelled exactly, with a small white star under it. No other text. ' +
      'The pet must be fully redrawn in the illustration style: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No logos, no border. Vertical 4:5.'
  },
  'momento-ilustrado': {
    needsName: false,
    font: 'manuscrita',
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-momento-ilustrado.jpg',
    textPrompt: 'Add the text "{NAME}" in {FONT}, dark charcoal, small and centred at the bottom on the white background, spelled exactly. ',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its people, faces, clothes or objects. ' +
      'Repaint the first image as a new warm editorial illustration in exactly the same style as the second image: ' +
      'soft flat colour shapes with a fine dry-brush and paper grain texture, gentle shading, rosy cheeks, simplified but expressive faces, ' +
      'no background scene: the people and the main objects of the photo float on a plain warm off-white background, with a loose painted brush stroke under them as a base. ' +
      'Keep every person and pet from the first image, with their faces, hair, expressions, clothes and poses recognisable, and keep meaningful objects (a cake, flowers, a gift). ' +
      'It must be a completely new hand-made illustration: never keep or paste photographic pixels. Do not add or remove people. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'acuarela-familia': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-acuarela-familia.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Repaint the first image as a watercolour illustration in exactly the same style as the second image: ' +
      'soft watercolour on textured white paper, warm cosy light, gentle outlines, irregular painted edges fading into the white paper. ' +
      'Keep every person and pet from the first image, their faces, hair, clothes, poses and the setting, recognisable. ' +
      'Do not add or remove people. No text, no logos, no border. Vertical 4:5.'
  },
  'pareja-acuarela': {
    needsName: true,
    font: 'manuscrita',
    aspectRatio: '3:4',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-pareja-acuarela.jpg',
    prompt:
      'The first image is the customer\'s photo: these are the only people to paint. The second image only shows the painting technique: none of its people, faces, hats, clothes or text may appear. ' +
      'Paint a brand-new watercolour portrait of the people from the first image with the technique of the second image: an illustrator\'s loose hand-painted watercolour on textured cream cotton paper, ' +
      'soft washes and visible brush strokes on the faces, skin, hair and clothes, gently simplified painterly features, wet edges and pigment granulation. It must clearly look painted with a brush, never like a photo or a photo filter. ' +
      'Behind them a loose patch of soft sky-blue wash with irregular edges fading into the plain paper; no background scene and no objects from the photo. Framed from about the waist up, centred in the upper two thirds. ' +
      'Keep every person from the first image recognisable: face shape, expression, hair, skin tone, clothes and pose. Do not add or remove people. ' +
      'Below the painting write exactly "{NAME}" (letter by letter: {SPELL}) in elegant flowing calligraphy script in dark charcoal grey, centred. ' +
      'No other text, no brand logos, no border. Vertical 3:4.'
  },
  'pareja-sin-rostro': {
    needsName: true,
    font: 'manuscrita',
    aspectRatio: '3:4',
    refFirst: true,
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-pareja-sin-rostro.jpg',
    prompt:
      'The first image is the finished faceless watercolour template. The second image is the customer\'s photo. ' +
      'Edit the first image: replace the two people with the people from the second image and keep everything else of the first image exactly as it is: ' +
      'the same loose hand-painted watercolour technique with visible brush strokes and paper texture, the same pale blue wash with irregular edges fading into the plain cream paper, the same waist-up framing. ' +
      'IMPORTANT: every face is completely blank, exactly like the template: a smooth flat skin-coloured oval with NO eyes, NO eyebrows, NO nose, NO mouth and no facial features at all. ' +
      'Keep every person from the second image recognisable only by their hair, skin tone, clothes, accessories and pose. Do not add or remove people, and leave out objects from the photo. ' +
      'Nothing photographic: everything painted with a brush. ' +
      'Replace the text at the bottom: write exactly "{NAME}" (letter by letter: {SPELL}) in the same elegant calligraphy script and dark charcoal colour, centred. Never copy the names or date of the template. ' +
      'No other text, no brand logos, no border. Vertical 3:4.'
  },
  'familia-acuarela': {
    needsName: false,
    font: 'manuscrita',
    aspectRatio: '3:4',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-familia-acuarela-circulo.jpg',
    textPrompt: 'Under the circle write exactly "{NAME}" (letter by letter: {SPELL}) in elegant flowing handwritten script in dark charcoal, centred; never write the words of the second image. ',
    prompt:
      'The first image is the customer\'s photo: these are the only people (and pets) to paint. The second image only shows the painting technique and layout: none of its people, faces, clothes or text may appear. ' +
      'Paint a brand-new watercolour family portrait of the people from the first image with the technique of the second image: detailed hand-painted watercolour on textured cream cotton paper, ' +
      'soft washes and visible brush strokes on faces, skin, hair and clothes, warm natural skin tones. It must clearly look painted with a brush, never like a photo or a photo filter. ' +
      'The group close together in front of a large soft dusty-blue watercolour circle, the bottom of the group fading softly into the plain paper; no background scene and no objects from the photo. ' +
      'Keep every person and pet from the first image recognisable: face shape, expression, hair, skin tone, clothes and pose. Do not add or remove anyone. ' +
      'If no text is requested, leave the paper under the circle empty. No brand logos, no border. Vertical 3:4, the circle in the upper part.'
  },
  'mascota-acuarela': {
    needsName: true,
    font: 'manuscrita',
    aspectRatio: '3:4',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascota-acuarela.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, breed, colours or face. ' +
      'Paint a new realistic watercolour portrait of the pet from the first image in exactly the same style as the second image: warm wet-on-wet watercolour with fine brush detail in the fur, ' +
      'head and chest only, facing the viewer, happy expression, on plain warm cream paper with no background, the chest fading softly into the paper with loose painted edges. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and position, fur length, colours, every marking and eye colour. Exactly one animal with one head. No collar, clothes or accessories. ' +
      'Never keep or paste photographic pixels or the photo background. ' +
      'Above the head write the name "{NAME}" in elegant flowing calligraphy script in warm sepia brown, centred, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 3:4.'
  }
};
