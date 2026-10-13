/**
 * Illustration templates. The key is the "Plantilla" id set in the product's template-studio block.
 * - reference: the template image Replicate copies the style from (second image).
 * - prompt: what to do with the customer's photo (first image). {NAME} is replaced with the name.
 * Prompts are fixed here on purpose: customers can't send their own prompts.
 */
export const TEMPLATES = {
  'retrato-nombre': {
    needsName: true,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new portrait painting of the pet from the first image in exactly the same style as the second image: ' +
      'thick impasto oil paint with visible palette-knife and brush strokes, plain warm off-white background, ' +
      'the animal facing forward and centred, framed from the chest up, happy expression. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. No clothes or accessories. ' +
      'Write the name "{NAME}" small in clean black sans-serif capital letters with wide letter spacing, centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'retrato-sudadera': {
    needsName: true,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-retrato-nombre.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new portrait illustration of the pet from the first image in exactly the same style as the second image: ' +
      'flat hand-painted illustration with soft brush texture, plain pastel pink background, the animal facing forward, ' +
      'happy expression, wearing a pink hoodie with white drawstrings, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'Write the name "{NAME}" in large white hand-painted brush capital letters centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'oleo-vintage': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-oleo.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new vintage oil painting of the pet from the first image in exactly the same style as the second image: ' +
      'fine textured oil brushwork, background of vertical pale blue and cream stripes, ' +
      'the pet wearing a cream headscarf with small blue flowers tied under the chin, head slightly tilted, sweet expression, framed from the chest up. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
  },
  'en-su-rincon': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/estilo-mascotas-en-casa.jpg',
    prompt:
      'The first image is the customer\'s photo: it is the subject. The second image is only a style reference: never copy its animal, people, breed or face. ' +
      'Create a new painting of the pet from the first image in exactly the same style as the second image: ' +
      'textured painterly brushwork, the pet lying relaxed on a soft pale blue sofa with its head resting on a blue cushion, ' +
      'plain warm off-white wall behind, calm cosy mood, looking at the viewer. ' +
      'It must be the very same individual animal as in the first image, instantly recognisable to its owner: same breed or mix, head and muzzle shape, ear shape, size and position, fur length, colours, every marking and eye colour. ' +
      'No text, no logos, no border. Vertical 4:5.'
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
