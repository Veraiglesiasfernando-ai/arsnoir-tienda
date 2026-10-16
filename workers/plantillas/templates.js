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
      'the same upright, straight-on pose with the head level and looking at the viewer, the same head-and-chest framing and size. Background: plain flat {COLOR}. ' +
      'Do not copy the pose, head tilt, lying position or angle of the photo: the pet sits upright like the template animal. ' +
      'The pet must be fully redrawn as flat vector shapes: never keep photographic pixels, photo fur texture or anything of the photo background. Exactly one animal with one head and two ears. ' +
      'It must be the very same individual animal as in the second image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape and colour, fur length, colours, every spot and marking and eye colour. Nothing of the template animal\'s breed, colours or markings may remain. ' +
      'No text, no logos, no border. Vertical 3:4.'
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
  }
};
