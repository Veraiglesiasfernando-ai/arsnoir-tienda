# Ficha de producto · rediseño aprobado (13/11/2026)

El dueño quiere la ficha **ordenada como la de una tienda grande de láminas**: cada decisión en su sitio. Hay que tomar la **estructura**, no copiar el diseño, la marca ni los textos de nadie.

## Decisiones del dueño
- Orden de arriba abajo: **título · precio «Desde X €» · Tipo · Tamaño · Marco · botón grande · checklist**.
- **Tipo**: botones grandes con dibujo. Obras: **Lámina · Lienzo**. Retratos: **Lámina · Lienzo · MIXPIX**. «Con marco» no es un tipo: es un paso aparte.
- **Tamaño**: **desplegable**, no botones. Texto: «Elige un tamaño · N tamaños disponibles · Hasta 60×90 cm».
  - Al lado, botón **«Guía de tamaños»** → `/pages/guia-de-tamanos`.
- **Marco**: tarjetas con **foto del marco** en un carrusel horizontal: **Sin marco · Negro · Blanco · Madera**.
  - Lienzo: sin marco o marco flotante.
  - MIXPIX: sin marco, negro o blanco.
  - Fotos ya en Files: `arsnoir-marco-black|white|wood(-detalle).webp`.
- Botón negro grande: **«AÑADIR AL CARRITO»**.
- Debajo, 4 líneas con ✓, en dos columnas:
  - Se imprime por encargo, solo para ti.
  - Llega en {delivery_min}–{delivery_max} días hábiles.
  - Envío gratis desde 80 €.
  - Política de devoluciones (enlace).
- **Retratos**: el estudio («sube su foto») va **antes de Tipo**.

## Lo que NO se pone (reglas del dueño)
- Nada de precio tachado ni «-45 %» salvo descuento real (Omnibus: precio más bajo de 30 días).
- Nada de corazones, número de puntuaciones ni estrellas inventadas. Solo reseñas reales de Judge.me.

## Cómo está ahora (para no romper nada)
- `sections/main-product.liquid`: `<variant-picker class="vsteps">` (línea ~286).
  - Pasos de tamaño (`vsel__list`) y de acabado (`ftiles`, con `data-p` y `data-s` para producto y estilo).
  - `<script data-variants>` con las variantes.
  - Etiquetas en `snippets/option-label.liquid`. El selector de packs MIXPIX está en `snippets/mixpix-styles.liquid` y escucha a `variant-picker`.
- Opciones de las **obras** (Gelato):
  - `Size`: 21x29.7 / A3 / A2 / 50x70 / A1 / 60x90.
  - `Product`: Premium Matte Paper Poster / Wooden Framed Poster / Canvas / Framed Canvas.
  - `Style`: - / Black / White / Wood frame / Slim / Thick.
- Opciones de los **retratos**:
  - `Tamaño`: A4…XL, 20×25…60×80 y MIXPIX suelto / pack de 2, 3, 6.
  - `Acabado`: Sin marco / Marco negro / Marco blanco / Marco madera / Lienzo / Lienzo con marco negro / Lienzo con marco madera.
- Banco de pruebas local: `scratchpad/ltest/render-pdp.js <json> <handle> <template>`. La sesión nueva tendrá que rehacerlo si no tiene el scratchpad.

## Flujo de trabajo
- Editar en local → commit → push → subir **solo al tema de prueba 201530278272**.
- Antes de subir, comparar las sumas de control con el editor.
- Probar en móvil (390 px) y en ordenador.
- Enseñar capturas al dueño **antes** de dar nada por terminado. **Nunca publicar el tema**: lo publica el dueño.

## Estado (13/11/2026)
- Hecho en la rama `claude/modest-turing-4r8uxx` (sin subir a ningún tema):
  - `snippets/pdp-chooser.liquid`: Tipo (botones con dibujo y «Desde» real) · Tamaño (desplegable, «N tamaños disponibles · Hasta …», «Guía de tamaños») · Marco (tarjetas con foto en fila deslizable).
  - Por debajo usa el `<variant-picker>` de siempre (oculto con `.vsteps--v2`): marca sus radios y lanza «change», así que precio, carrito, estudio y MIXPIX siguen igual.
  - `main-product.liquid`: ajuste de sección «Ficha nueva» (`pdp_v2`, activado por defecto) para volver a la ficha antigua. Precio «Desde X €» hasta elegir tamaño (también en la barra fija). Botón negro «AÑADIR AL CARRITO» sin precio. Checklist de 4 líneas en dos columnas. El bloque «delivery» no se pinta (lo dice la checklist).
  - Sin tamaño elegido, «Añadir al carrito» no añade: señala el desplegable.
  - **Arreglado un fallo que ya existía:** el selector de estilos MIXPIX (`mixpix-styles.liquid`) se ejecutaba antes de que existiera el formulario y no aparecía nunca. Ahora espera a que cargue la página.
- **El tema 201530278272 ya no es de prueba: ahora es el publicado (MAIN).** No se ha subido nada. Hace falta un tema de prueba nuevo (copia del publicado). Sus archivos coinciden con la rama principal (sumas de control comprobadas), así que en una copia se pueden subir los cambios sin pisar nada.
- Banco de pruebas local reconstruido: `scratchpad/ltest/render-pdp.js <datos.txt> <handle> <plantilla.json> <salida.html> [variante]` + `shot.js` (capturas a 390 px con Playwright).
