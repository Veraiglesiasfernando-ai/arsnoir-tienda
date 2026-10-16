# Meta Ads para ARSNOIR — plan de ataque (Q4 2026)

Escrito el 16/10/2026 con los datos reales de Shopify, los márgenes de Gelato (`docs/gelato-margenes.md`) y lo que funciona en Meta este año.
Creativos listos en `media/ads/` (se regeneran con `python3 data/meta-ads-creativos.py`).

---

## 1. Dónde estás hoy (datos reales de Shopify, últimos 90 días)

| Métrica | Valor |
|---|---|
| Visitas | 215, **todas directas** (ninguna de redes ni de Google) |
| Sesiones con añadido al carrito | 1 |
| Pedidos | 0 |

Qué significa:
- **El píxel de Meta no tiene historial.** Meta no sabe aún quién compra en ARSNOIR. Las primeras 2–3 semanas de anuncios sirven para enseñárselo: hay que aguantar sin tocar nada a diario.
- Esas 215 visitas son casi seguro tuyas y de gente cercana. Todavía no sabemos si la web convierte: lo sabremos con el tráfico de los anuncios.
- La ventaja: llegas justo a tiempo para Black Friday y Navidad, la mejor época del año para vender arte de pared y regalos personalizados.

## 2. Antes de gastar 1 €: lista obligatoria

1. **App «Facebook & Instagram» de Shopify** instalada y conectada (Shopify Admin → Canales de venta). En su configuración pon **«Compartir datos: Máximo»**: activa el píxel y la API de conversiones (CAPI). El tema no tiene el píxel en el código, así que tiene que ir por la app.
   - Esto es crítico en España: con el aviso de cookies, quien pulsa «Rechazar» no se mide en el navegador. La CAPI recupera parte de esas compras desde el servidor.
2. **Verifica el dominio** `arsnoir.com` en el Business Manager (Configuración del negocio → Seguridad de la marca → Dominios).
3. **Comprueba los eventos** en el Administrador de eventos → «Probar eventos»: abre la web, mira una obra (ViewContent), añádela al carrito (AddToCart), empieza el pago (InitiateCheckout). Si salen los tres, la compra también se registrará.
4. **Catálogo sincronizado** (lo hace la misma app). Sirve para anuncios de catálogo más adelante.
5. **Instagram con un mínimo de vida**: 9–12 publicaciones (usa los creativos y reels de este repo). Quien hace clic en el perfil desde un anuncio y lo ve vacío no compra.
6. **Un solo código de bienvenida.** El README habla de `ARSNOIR10` en el pop-up y de `WELCOME10` en las promociones. Comprueba que el pop-up enseña el código que existe en Shopify.
7. **Haz un pedido de prueba real** (de una A4, por ejemplo) de punta a punta: anuncio → ficha → pago → email → Gelato. Es la única forma de estar seguro de que todo funciona antes de pagar tráfico.

## 3. Tu mercado

### Qué vendes y a quién (4 compradores distintos)

| # | Comprador | Qué le mueve | Producto | Colección (URL de destino) |
|---|---|---|---|---|
| A | **Quien regala con emoción**: mujer de 25 a 55 años, con perro o gato, o que busca regalo para alguien que lo tiene | Emoción, «nadie más lo tiene», llorar al abrirlo | Retratos de mascota (6 estilos) y Acuarela en casa (familia) | `/collections/personalizalo` |
| B | **El del motor**: hombre de 18 a 45 años, coches, F1, rally, gaming | Identidad («esto soy yo»), su cuarto o despacho | Ferrari, Rally, Alerón, Pinza de freno, Última marcha… (19 obras) | `/collections/motor` |
| C | **El de la mentalidad**: hombre de 18 a 34 años, gimnasio, emprender, deporte | Motivación diaria, estética oscura | Rise to the Top, Obsesión, Tú vs tú, Legend (11 obras) | `/collections/mindset` |
| D | **La que decora su casa**: mujer de 25 a 45 años, piso nuevo o redecorando | Que la casa «se sienta» suya, estética de revista | Panter, Tigre, Koi, Flamingo, Blush… | `/collections/animals`, `/collections/art`, `/collections/escape` |

**Prioridad para Q4: A > B > D > C.**
- El **retrato de mascota** es el producto con más potencial de Meta en Navidad: regalo emocional, imposible de comparar en precio, y con la ventaja de la **vista previa gratis antes de pagar**. Eso casi nadie lo ofrece.
- **Motor** tiene el público más fácil de reconocer en 1 segundo de scroll.

### Competencia y cómo ganarle

| Competidor | Qué hace en Meta | Tu ángulo para ganarle |
|---|---|---|
| **Desenio** | ~400 anuncios activos, ~18 nuevos por semana; titulares, unboxing, salas decoradas y descuentos constantes | No compitas en descuento. Compite en **«arte original, solo en ARSNOIR»** y en temáticas con identidad (motor, mentalidad) que Desenio no tiene. |
| **Displate** | ~830 anuncios activos; precio y volumen (packs, hasta −40 %) | Ellos venden chapa metálica de fan. Tú vendes **papel de galería y marco de madera listo para colgar**. |
| **Etsy y apps de retrato con IA** | Barato y rápido, calidad irregular, sin impresión cuidada | **Vista previa antes de pagar + impresión giclée + marco + envío en Europa**. Es el producto terminado, no un archivo. |

(Cifras de anuncios: biblioteca de Motion. Antes de lanzar, revisa tú mismo la [Biblioteca de anuncios de Meta](https://www.facebook.com/ads/library/) filtrando por España y buscando «desenio», «retrato mascota», «cuadro personalizado» y «póster coche». Fíjate en qué anuncios llevan más de 30 días activos: esos son los que funcionan.)

## 4. Los números que mandan

Margen por pedido (de `docs/gelato-margenes.md`, sin comisión de pago ni descuentos):

| Pedido típico | Precio | Ganas | CPA máximo (para no perder) | CPA objetivo (para ganar) |
|---|---|---|---|---|
| Póster A4 suelto | 24,95 € | 13,51 € | 13 € | **no anunciar solo** |
| Póster 50×70 | 59,95 € | 27,88 € | 27 € | 18 € |
| Póster A1 | 69,95 € | 33,51 € | 33 € | 22 € |
| Marco A3 | 69,95 € | 31,82 € | 31 € | 21 € |
| Marco 50×70 | 124,95 € | 39,10 € | 39 € | 26 € |
| Retrato mascota con marco A3 | 69,95 € | ~30 € (Gelato + IA + tu tiempo) | 30 € | 20 € |

Conclusiones:
- **Tu número mágico: CPA de 20–25 €.** Por debajo ganas dinero. Por encima, pierdes en el primer pedido.
- **ROAS para no perder: 2,5 aprox.** (ingresas 2,5 € por cada euro de anuncios). Apunta a un ROAS de 3 o más.
- **Empuja el ticket medio por encima de 80 €** (envío gratis) **y de 120 €** (A4 de regalo, que ya está activo). Los anuncios nunca deben llevar a la A4 suelta: lleva a la colección y deja que el carrito haga su trabajo.
- Los creativos venden «desde 24,95 €» para que el precio no asuste, pero las fichas ya abren con el tamaño recomendado.

Coste de Meta en España (referencias públicas 2026, solo orientativas): CPM de 7 a 15 € y CPC de 0,5 a 1,2 € en campañas de venta. Con un CPC de 0,8 € y una conversión del 1,5 %, el CPA sale a 53 €. **Para llegar a 20–25 € hace falta una conversión del 3 % o más, o un ticket más alto.** Por eso los creativos tienen que traer gente con ganas de comprar, no curiosos.

## 5. Estructura de campañas

Con el algoritmo actual de Meta (Andromeda), **el creativo es la segmentación**. Una sola campaña amplia con muchos anuncios distintos rinde más que muchos conjuntos con intereses.

### Fase 1 — Aprendizaje (17 oct → 19 nov)

```
Campaña: ARSNOIR | Ventas | Advantage+ (objetivo Ventas, evento Compra)
└── Conjunto único
    ├── País: España (añade Portugal, Francia o Italia solo cuando España funcione)
    ├── Público: amplio, 18–65+, sin intereses (Advantage+ audience)
    ├── Ubicaciones: Advantage+ (todas)
    ├── Presupuesto: 30 €/día (≈ 900 €/mes)
    └── Anuncios: los 10 creativos de media/ads + 3 reels de media/social/reels-rb
```

- **Mejoras automáticas de Advantage+ Creative:** desde 2026 vienen activadas por defecto. Deja **activadas** «Ajustes de visualización» y «Mejoras de texto». **Desactiva** «Generar fondos o imágenes con IA», «Añadir música» y «Superposiciones de texto» en las imágenes: tus creativos ya llevan su texto y la IA de Meta no debe tocar las obras ni las mascotas.
- **No toques nada 4 días.** Cada cambio de presupuesto o de anuncio reinicia el aprendizaje.
- **Sin campaña de retargeting aparte** hasta superar unas 1.000 visitas por semana: Advantage+ ya enseña los anuncios a quien visitó la web.
- **Si no tienes compras tras unos 300 € de gasto,** mira los añadidos al carrito. Si hay muchos carritos y ninguna compra, el problema está en el envío o en el pago, no en los anuncios.

### Reglas para decidir (cada lunes)

| Señal | Qué hacer |
|---|---|
| Anuncio con más de 40 € gastados y ningún añadido al carrito | Apágalo |
| CTR de enlace por debajo del 0,8 % tras 1.500 impresiones | El gancho no engancha: cambia la primera frase o la imagen |
| Anuncio con compras a un CPA de 25 € o menos | **Ganador**: haz 3 variaciones del mismo concepto (otro gancho, otro formato, otra obra) |
| CPA de toda la campaña por debajo de 25 € durante 5 días | Sube el presupuesto un 20 % cada 3 días |
| Frecuencia por encima de 3 en 7 días | Faltan creativos nuevos: añade 3–5 |

**Ritmo de creativos: 3–5 nuevos cada semana.** No variaciones del mismo, sino ideas nuevas. Al principio tus anuncios no te dicen qué público funciona: te lo dicen qué *concepto* gana.

### Fase 2 — Black Friday (20 → 30 nov)

- El tema ya cambia solo a modo Black Friday. **Decide ya la oferta** (*Configuración del tema → Campaña Q4*). Recomendación que protege el margen: **no hagas % global**. Usa «2 obras = −15 %» o adelanta la A4 de regalo a 80 €. Desenio y Displate van a regalar descuentos y no les vas a ganar en precio.
- Sube el presupuesto a **50–60 €/día solo si la Fase 1 dio compras a 30 € de CPA o menos**. Si no, mantén 30 €.
- Añade 2–3 creativos de Black Friday con la misma estética que el `c09` (fondo negro, titular gigante).

### Fase 3 — Navidad (1 → 16 dic) y Reyes (17 dic → 2 ene)

- **El personalizado tiene una fecha límite más temprana.** Hay que generar la ilustración, ampliarla, pedirla a mano en Gelato y esperar 4–10 días de producción y envío. Fecha límite recomendada para los anuncios de mascota y familia «llega antes de Navidad»: **10 de diciembre**. Después cambia el mensaje a «para Reyes».
- Pesa más el comprador A (regalo). Todos los textos en clave de regalo: «para ella», «para tu madre», «para quien quiere a su perro más que a nadie».
- Del 20 dic al 6 ene: **tarjeta regalo** (llega al instante) con un creativo propio.

## 6. Los 10 creativos (en `media/ads/`)

Cada uno sale en 2 formatos: `-4x5.jpg` para el feed (1080×1350) y `-9x16.jpg` para stories y reels (1080×1920, con el texto fuera de las zonas que tapa Instagram). **Sube los dos en el mismo anuncio** («Personalizar el contenido por ubicación»).

| ID | Concepto | Comprador | Enlace |
|---|---|---|---|
| c01 | **Tu foto → tu obra** (husky → «Lina») | A | `/products/retrato-con-sudadera` |
| c02 | **Ese momento, para siempre** (cumpleaños → acuarela) | A | `/products/acuarela-en-casa` |
| c03 | **Hay quien colecciona coches** (Ferrari en el salón) | B | `/collections/motor` |
| c04 | **Lo primero que ves cada mañana** (Obsesión en el despacho) | C | `/collections/mindset` |
| c05 | **¿Pared vacía? Elige la tuya** (cuadrícula de 6 obras) | D | `/collections/obras` |
| c06 | **Tú eliges el acabado** (Panter sin marco, blanco y madera) | D | `/products/panter` |
| c07 | **Tu dormitorio merece algo salvaje** (Tigre) | D | `/collections/animals` |
| c08 | **Una foto, seis estilos: ¿cuál es más él?** | A | `/collections/personalizalo` |
| c09 | **Regalo doble: desde 120 €, un A4 gratis** (Navidad) | Todos | `/collections/obras` |
| c10 | **Abrir la caja. Colgarla. Listo.** (unboxing) | D / B | `/collections/mas-vendidos` |

Añade a todos los enlaces el parámetro `?utm_source=meta&utm_medium=paid&utm_campaign=q4&utm_content=c01` (cambia el `c01` por el ID de cada anuncio) para verlo también en Shopify.

### Textos (copia y pega)

Pon 3 textos principales y 2 titulares por anuncio: Meta prueba las combinaciones.

**c01 / c08 — Mascota**
- Texto 1: `Sube una foto de tu perro. En segundos ves cómo queda en ilustración. Si te encanta, te la imprimimos y te llega lista para colgar. 🐾`
- Texto 2: `El regalo que va a hacer llorar a alguien estas Navidades (de lo bonito). Retrato de su mascota en 6 estilos. Vista previa gratis antes de pagar.`
- Texto 3: `No es un archivo. Es una obra: papel de galería, tintas que duran décadas y marco de madera listo para colgar. Pruébalo con tu foto.`
- Titulares: `Tu mascota, convertida en arte` · `Mira la vista previa gratis`

**c02 — Familia**
- Texto 1: `Esa foto que tienes guardada en el móvil merece algo más. La convertimos en acuarela y te llega a casa lista para colgar.`
- Texto 2: `¿Qué regalas a la madre que lo tiene todo? Un recuerdo que no tenía en la pared. Sube la foto y mira cómo queda antes de pagar.`
- Titulares: `Vuestra foto, en acuarela` · `El regalo que no van a olvidar`

**c03 — Motor**
- Texto 1: `Para los que reconocen un motor antes de verlo. Pósters de motor en edición ARSNOIR, impresos bajo pedido. 🏁`
- Texto 2: `Tu garaje no cabe en el salón. Tu coche favorito, sí. Desde 24,95 €, con marco listo para colgar.`
- Texto 3: `Ferrari, rally, alerones y pinzas de freno. 19 obras para tu cuarto, tu despacho o tu taller.`
- Titulares: `Colección Motor` · `Cuélgalo. No lo aparques.`

**c04 — Mentalidad**
- Texto 1: `Lo primero que ves al despertar cambia cómo empiezas el día. Elige bien.`
- Texto 2: `Para los que entrenan cuando nadie mira. Obras de mentalidad para tu habitación o tu despacho.`
- Titulares: `Rise to the Top` · `Tú contra tú`

**c05 / c07 / c06 — Decoración**
- Texto 1: `No decores tu espacio. Cambia cómo se siente. Arte original que solo encontrarás en ARSNOIR.`
- Texto 2: `Esa pared vacía lleva meses esperando. Elige obra, tamaño y marco: llega en 4–10 días lista para colgar.`
- Texto 3: `Papel mate de 200 g, impresión giclée de 12 tintas y marco de madera maciza. Calidad de galería, sin precio de galería.`
- Titulares: `Arte original para tu pared` · `Envío gratis desde 80 €`

**c09 — Navidad**
- Texto 1: `Esta Navidad, regalo doble: con tu pedido desde 120 € te llevas un póster A4 de regalo. Tú eliges cuál, directamente en el carrito. 🎁`
- Titulares: `Un A4 de regalo desde 120 €` · `Pide antes del 16 de diciembre`

**c10 — Así llega**
- Texto 1: `Así llega una obra ARSNOIR: protegida, con marco y lista para colgar. Solo tienes que elegir la pared.`
- Titulares: `Llega lista para colgar` · `De la imprenta a tu pared`

> No uses cifras que no puedas probar: «miles de clientes», reseñas o estrellas. Meta las penaliza y el cliente tampoco se las cree. En cuanto tengas reseñas reales, haz un creativo con ellas.

## 7. Vídeo: lo que más venderá

Las imágenes sirven para empezar. El **vídeo vertical de 7–15 s grabado con el móvil** es lo que más escala en 2026.

### Los reels que ya tienes

| Reel | ¿Sirve para anuncio? | Cómo usarlo |
|---|---|---|
| `reels-rb/01-posters-coches.mp4` | ✅ Sí, formato nativo | Úsalo tal cual para el comprador B |
| `reels-rb/02-elige-uno.mp4` | ✅ Sí | Comprador D |
| `reels-rb/03-mentalidad.mp4` | ✅ Sí | Comprador C |
| `reel-mejora-tu-foto.mp4`, `reel-sube-tu-foto.mp4`, `reel-personalizalo*.mp4` | 🟡 Tienen buena información pero un aire «de marca» y texto pequeño | Úsalos como 2.º o 3.º anuncio de mascota. Mejor aún: graba el guion 1 de abajo |
| `reel-arsnoir-obras.mp4` | ❌ No como anuncio | Arranca con el logo en negro: el 70 % de la gente pasa en el primer segundo. Déjalo para el perfil de Instagram |
| `reel-asi-llega.mp4`, `reel-llega-con-marco.mp4`, `reel-impresion-v2.mp4` | 🟡 Para retargeting de confianza | Funcionan cuando Advantage+ los enseña a quien ya visitó la web |

### 6 guiones para grabar con el móvil (sin actores)

Regla de oro: **el primer segundo decide todo.** Empieza con movimiento, una cara o un texto que dé curiosidad, nunca con el logo.

1. **«Le hice esto a mi perro» (A)**: plano de tu perro de verdad → pantalla del móvil subiendo su foto → la vista previa aparece → corte al cuadro colgado y el perro delante. Texto: *«Le hice esto a mi perro y ahora está en el salón»*. 10 s.
2. **Reacción al abrir el regalo (A)**: manos abriendo la caja, se ve el retrato, reacción (risa o «noooo»). Texto: *«Le regalé a mi madre su perro en óleo»*. Pide a un familiar que lo grabe de verdad. 12 s.
3. **«Elige uno» de pared (D)**: plano fijo de una pared vacía → cambian 4 obras (con los mockups de `media/rooms`) → «¿cuál te quedas?». Fomenta comentarios, y los comentarios abaratan el anuncio. 8 s.
4. **Motor ASMR (B)**: sonido de motor real → manos colgando el póster de Ferrari → plano final. Texto: *«Mi coche favorito no cabe en el garaje. En la pared, sí»*. 8 s.
5. **Antes y después de habitación (C / D)**: habitación sosa, chasquido de dedos, la misma habitación con 2 obras. Texto: *«Mi cuarto antes y después de 2 cuadros»*. 7 s.
6. **Lo que no se ve (D)**: primeros planos del papel, el marco de madera, la caja y el colgador. Texto: *«Por qué un póster de 25 € no es igual que otro»*. 12 s.

Pon siempre **subtítulos grandes** (el 80 % lo ve sin sonido) y termina con la obra en la pared más el texto «arsnoir.com».

### Banco de ganchos (primera frase del vídeo o del texto)

- «Nadie va a tener este cuadro en su casa. Solo tú.»
- «Le enseñé esto a mi madre y lloró.»
- «Tu perro merece estar en la pared, no solo en tu galería del móvil.»
- «POV: por fin decoras el piso nuevo.»
- «3 cuadros para tu habitación si te flipan los coches.»
- «La pared de tu despacho dice mucho de ti.»
- «Esto no es un póster de Ikea.»
- «Regalo para quien lo tiene todo (menos esto).»
- «Elige uno. Solo uno.»
- «Lo que ves cada mañana importa más de lo que crees.»
- «Así se imprime tu obra antes de llegar a casa.»
- «Si tu pared está vacía, este vídeo es para ti.»

## 8. Qué mirar cada semana

| Métrica | Bien | Revisar |
|---|---|---|
| CTR de enlace | > 1 % | < 0,8 % |
| CPC de enlace | < 0,80 € | > 1,20 € |
| Tasa de gancho del vídeo (vistas de 3 s ÷ impresiones) | > 25 % | < 15 % |
| Añadidos al carrito ÷ clics | > 6 % | < 3 % → problema de ficha o precio |
| Compras ÷ inicios de pago | > 45 % | < 30 % → problema de envío o pago |
| CPA | < 25 € | > 35 € durante 7 días |
| ROAS | > 3 | < 2 |

## 9. Calendario resumido

| Fecha | Acción |
|---|---|
| 16–17 oct | Lista de la sección 2 (píxel, CAPI, dominio, pedido de prueba). Instagram con 9 publicaciones |
| 17–18 oct | Lanzar la Fase 1 a 30 €/día con los 10 creativos y los 3 reels |
| 24 oct | 1.ª revisión: apagar los que no funcionan y grabar los guiones 1 y 3 |
| 31 oct · 7 nov · 14 nov | Revisión semanal + 3–5 creativos nuevos |
| 12 nov | Decidir la oferta de Black Friday y preparar sus creativos |
| 20–30 nov | Black Friday (subir presupuesto solo con datos) |
| 1–10 dic | Navidad: peso en mascota y familia («llega antes de Navidad») |
| 11–16 dic | Navidad, solo catálogo («llega antes de Navidad»); personalizado → «para Reyes» |
| 17 dic – 6 ene | Reyes y tarjeta regalo |

---

Fuentes: [Motion: Desenio](https://motionapp.com/library/desenio), [Motion: Displate](https://motionapp.com/library/displate), [Segwise: estrategia creativa con Andromeda](https://segwise.ai/blog/meta-andromeda-update-creative-strategy-2026), [ContentStudio: benchmarks de Meta 2026](https://contentstudio.io/blog/meta-ads-benchmarks), [Superads: CPC en España](https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click/spain/conversion), [Topgrowth: CPC en ecommerce](https://topgrowthmarketing.com/?p=42341).
