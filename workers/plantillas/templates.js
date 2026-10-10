/**
 * Illustration templates. The key is the "Plantilla" id set in the product's template-studio block.
 * - reference: the template image Replicate copies the style from (first image).
 * - prompt: what to do with the customer's photo (second image). {NAME} is replaced with the name.
 * Prompts are fixed here on purpose: customers can't send their own prompts.
 */
export const TEMPLATES = {
  'retrato-nombre': {
    needsName: true,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-retrato-nombre.jpg',
    prompt:
      'Use the first image only as the style reference and the second image as the subject. ' +
      'Create a new portrait illustration of the pet from the second image in exactly the same style as the first image: ' +
      'flat hand-painted illustration with soft brush texture, plain pastel pink background, the animal facing forward, ' +
      'happy expression, wearing a pink hoodie with white drawstrings, framed from the chest up. ' +
      'Keep the pet\'s breed, fur colours, markings and eye colour exactly as in the photo. ' +
      'Write the name "{NAME}" in large white hand-painted brush capital letters centred at the top, spelled exactly. ' +
      'No other text, no logos, no border. Vertical 4:5.'
  },
  'acuarela-familia': {
    needsName: false,
    aspectRatio: '4:5',
    reference: 'https://cdn.shopify.com/s/files/1/1020/8903/2064/files/plantilla-acuarela-familia.jpg',
    prompt:
      'Use the first image only as the style reference and the second image as the subject. ' +
      'Repaint the second image as a watercolour illustration in exactly the same style as the first image: ' +
      'soft watercolour on textured white paper, warm cosy light, gentle outlines, irregular painted edges fading into the white paper. ' +
      'Keep every person and pet from the photo, their faces, hair, clothes, poses and the setting, recognisable. ' +
      'Do not add or remove people. No text, no logos, no border. Vertical 4:5.'
  }
};
