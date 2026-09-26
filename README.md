# ARSNOIR — tema Shopify

Tema propio (Online Store 2.0) para vender arte de pared original.

## Instalar el tema

1. Shopify Admin → **Tienda online → Temas → Añadir tema → Conectar desde GitHub**.
2. Elige el repositorio `arsnoir-tienda` y la rama.
3. En el tema conectado pulsa **Personalizar** para editar textos e imágenes y, cuando esté listo, **Publicar**.

Cada cambio que se sube a la rama se sincroniza solo con el tema.

## Home

**Hero con vídeo:** la frase «No decores tu espacio. Cambia cómo se siente.» centrada en blanco, con el sello giratorio encima y el botón «Ver obras» debajo. La frase se edita en *Personalizar → Hero con vídeo → Frase principal*.

Estética: fondo blanco/gris claro con degradado suave, tipografía Space Grotesk (servida desde `assets/`), solo blanco, negro y grises. Todos los huecos de obra son placeholders vacíos listos para tu arte.

1. **Barra negra fija** (rota entre «Arte exclusivo de ARSNOIR…» y «Envío GRATIS a España y toda Europa…») y **cabecera de cristal fija** debajo: logo «arsnoir» a la izquierda, menú `arsnoir-menu` en el centro (Obras · Estilo · Color · Tamaño · Estancia · Temática · Ediciones, cada uno con desplegable de cristal), y buscador, cuenta y carrito a la derecha. El **buscador** se abre en un panel de cristal con búsquedas populares y resultados al escribir (obras, colecciones y sugerencias); también se abre con la tecla `/`. En móvil, todo va en el menú hamburguesa. Arriba del todo la cabecera es transparente (texto blanco sobre el vídeo del hero) y el cristal aparece al hacer scroll.
2. **Bienvenida:** «★ BIENVENIDO A ★», «ARSNOIR» gigante, subtítulo y 3 cartas cuadradas de cristal con esquineras. La del centro es la destacada, con el botón «Explorar obra +»; las laterales dicen «PRÓXIMAMENTE». Cada carta admite su propia imagen desde *Personalizar*.
3. **Marquesina roja** en bucle.
4. **Tira de confianza:** Arte 100% original · Impresión de alta calidad · Envío a toda España · Solo en ARSNOIR.
5. **Obras destacadas:** fila deslizable con índice `[001]` en rojo, precio y botón «VER TODAS». Usa la colección «Más vendidos».
6. **Newsletter negra:** «Únete a ARSNOIR», 15% en la primera compra, botón rojo «UNIRME».
7. **Footer negro:** el texto de la página «La Historia» y 4 columnas (menús `footer-tienda`, `footer-ayuda`, `footer-arsnoir`, `footer-legal`).

## Conversión

Ajustes globales en *Configuración del tema → Conversión*: umbral de envío gratis (por defecto 60 €), nota media y nº de reseñas, días de devolución.

- **Barra de anuncio** (sobre la cabecera): mensajes que rotan. Por defecto: envío gratis desde 60 €, 15% al unirte y «Arte 100% original · Solo en ARSNOIR».
- **Obras en tu pared:** 3 habitaciones. Sube tus propios mockups o fotos; sin imagen se muestra una habitación dibujada de ejemplo.
- **Reseñas:** solo se muestran en la tienda cuando añades reseñas **reales** como bloques. Sin reseñas, la sección solo se ve en el editor, con ejemplos marcados como tal. Las estrellas de la bienvenida aparecen solo si rellenas nota y nº de reseñas. En la ficha, las estrellas salen de los metafields estándar `reviews.rating` / `reviews.rating_count`, que rellenan apps como Judge.me.
- **Garantías:** envío, devoluciones, impresión de alta calidad y pago seguro.
- **FAQ:** tamaños, envío, materiales, marco y devoluciones, con datos estructurados para Google.
- **Comunidad / Instagram:** 6 fotos (tuyas o de clientes con permiso).
- **Ficha de producto:** etiqueta «Recomendado» en el tamaño más grande (o en el que indiques), aviso de envío gratis y lista de garantías bajo el botón.
- **Carrito:** barra «Te faltan X € para el envío gratis», botón rojo de pago y métodos de pago.
- **Footer:** «Pago 100% seguro» con los métodos de pago activos.

## Ficha de obra

- **Mírala en tu pared:** la obra en un salón, un dormitorio y una oficina, **a escala real**. Cambia sola con el tamaño y el marco elegidos. Sin fotos se muestran estancias dibujadas a escala; si subes fotos de paredes reales (*Personalizar → Obra → Mírala en tu pared*), indica el ancho de la pared en cm para que la escala sea correcta.
- **Comparador de tamaños:** todos los tamaños dibujados junto a una persona de 175 cm. Pulsando uno se selecciona. Lee los tamaños de la opción *Tamaño* (formatos «50 × 70 cm», «50x70», «A3»…).
- **Marcos con muestras:** la opción llamada *Marco* se muestra con muestras de color (sin marco, negro, blanco, madera).
- **Edición limitada:** en una obra, rellena los metafields *Edición limitada: nº de copias* y *copias vendidas*. La ficha muestra «Quedan X de N · tu copia será la nº…» y la tarjeta la etiqueta «ED. LIMITADA».
- **Pago a plazos:** aparece bajo el botón si activas Klarna o Shop Pay Installments en *Configuración → Pagos*.
- **Favoritos (corazón)** en cada obra y en la cabecera; la página `/pages/favoritos` los lista. **Vistas recientemente** al final de la ficha. Se guardan en el navegador del visitante.

## Carrito lateral (conversión)

Todo lo que se ve en el carrito son datos reales de Shopify; no hay contadores inventados, stock falso ni temporizadores de «carrito reservado».

- **Barra de regalo escalonada** (80 € → 1 obra de regalo, 150 € → 2): se calcula con el total del carrito sin las obras de regalo. Al llegar al tramo aparece en el carrito «Elige tu obra de regalo» con las obras de la colección elegida en *Configuración del tema → Carrito* (tamaño 21 × 29,7 sin marco). La obra elegida entra con la propiedad oculta `_regalo`; **su precio 0 € lo pone un descuento de Shopify** (Compra X y llévate Y). Si baja del tramo o el cliente usa un código que no combina, el tema quita el regalo sobrante.
- **Obras:** imagen, nombre, tamaño y acabado, cantidad, precio, eliminar, edición limitada y «Enmárcala» con todos los marcos disponibles.
- **Completa tu pared:** 3 obras sugeridas con «+ Añadir»; primero las que desbloquean el envío gratis.
- **Descuentos aplicados** (pack, códigos) leídos de `cart.discount_applications`; el pack muestra «✓ Pack de 2 aplicado — ahorras un 15%».
- **Envío:** «GRATIS» desde el umbral de *Conversión*; por debajo, la tarifa más barata real de Shopify para el país del visitante («desde X €») o «se calcula en el pago».
- **Pago seguro · importe**, y 3 sellos (valoración solo si hay reseñas reales, impresión, devoluciones).
- **Pop-up al cerrar el carrito:** apagado (la tienda no usa descuento de bienvenida). Si algún día se activa en *Configuración del tema → Carrito*, pide el email y aplica el código indicado ahí.

## Más ventas

- **Pop-up de novedades (sin descuento):** «Sé el primero en enterarte»: obras nuevas, ediciones limitadas y ofertas antes que nadie. Aparece solo con interés real (desde la 2.ª página vista de la visita, o al ir a salir en ordenador), nunca en el carrito ni encima del carrito o del aviso de cookies, y como mucho una vez cada 14 días. Los emails entran en Clientes con la etiqueta `newsletter`. Admite un código opcional, vacío por defecto.
- **Completa tu pared:** el carrito lateral y la página del carrito sugieren obras relacionadas (recomendaciones de Shopify), con un botón «+» para añadirlas.
- **Packs de pared:** sección de la home con 2 o 3 obras colgadas juntas y un botón para añadir el pack entero. Elige las obras en *Personalizar → Packs de pared*. En la tienda solo se ven los packs con obras.
- **Es un regalo:** casilla en el carrito que guarda el atributo «Regalo» y el mensaje como nota del pedido (*Configuración del tema → Conversión*).
- **País, moneda e idioma:** selector de cristal en la cabecera, que aparece en cuanto actives más países o idiomas en *Configuración → Mercados / Idiomas*.

## Temporada Q4 (Black Friday, Navidad, Reyes)

Todo en *Configuración del tema → Campaña Q4*. Cada fase se activa sola por fecha:

| Fase | Fechas por defecto | Qué cambia |
|------|--------------------|-----------|
| Acceso anticipado | desactivado (empieza con la Black Week) | Si adelantas «Empieza la temporada», banda negra con cuenta atrás y lista de espera de Black Friday (clientes etiquetados `black-friday`). |
| Black Friday | 20 – 30 nov (Black Week + Cyber Monday) | «BLACK FRIDAY» gigante, oferta y código con botón de copiar, cuenta atrás hasta el final. |
| Navidad | 1 – 16 dic | «Pide antes del 16 de diciembre», cuenta atrás, guía de regalos y tarjeta regalo. |
| Reyes | 17 – 28 dic | «Todavía llega para Reyes». |
| Última hora | 29 dic – 6 ene | Tarjeta regalo (llega al instante). |

En temporada también aparece **«Regalos»** en el menú, la **guía de regalos** en la home (por precio y tarjeta regalo) y la página `/pages/regalos`. En la ficha y el carrito, **«Pídelo hoy y recíbelo entre el … y el …»** (días hábiles, sin festivos nacionales) indica si llega antes de Navidad o de Reyes.

Para ver una fase antes de tiempo: añade `?q4=prebf`, `?q4=bf`, `?q4=xmas`, `?q4=reyes` o `?q4=late` a la URL (`?q4=auto` para volver).

## Idiomas

Todos los textos fijos del tema (botones, carrito, buscador, ficha, pop-up…) salen de `locales/`: `es.default.json` (español, por defecto) y `en.json` (inglés). Para vender en otros idiomas:

1. *Configuración → Idiomas*: añade y publica el inglés (u otro idioma).
2. *Configuración → Mercados*: añade el mercado de Europa.
3. Instala **Translate & Adapt** para traducir productos, páginas, menús y los textos que escribes en *Personalizar*.

El selector de cristal de la cabecera (icono del globo) aparece solo en cuanto hay más de un idioma o país. Para otro idioma, copia `en.json` como `fr.json`, `de.json`…, y tradúcelo (o hazlo desde Translate & Adapt).

## Navegación y páginas

- **Transiciones entre páginas:** fundido suave sin pantallazo blanco. La cabecera se queda fija entre páginas en Chrome, Edge y Safari 18+. En el resto de navegadores, entrada suave. Además, los elementos aparecen al hacer scroll. Todo se desactiva si el visitante tiene activada la opción del sistema para reducir el movimiento.
- **Todas las páginas interiores** usan el mismo encabezado (migas de pan, texto pequeño rojo y título grande) y las mismas tarjetas en formato póster.
- **Manifiesto** (`page.manifiesto`): frases grandes numeradas sobre negro, marquesina y obras destacadas. **La Historia** (`page.historia`): texto, firma y obras.
- **Obras:** filtros de Shopify (tamaño, precio…), ordenación y paginación.
- **Carrito lateral:** se abre al añadir una obra, con barra de envío gratis.
- **Ficha:** barra de compra fija en móvil.
- **Páginas creadas en Shopify:** Preguntas frecuentes (`page.faq`), Envíos y devoluciones, Guía de tamaños y Política de cookies (borrador sin publicar).

## Aviso de cookies

Tarjeta de cristal redondeada abajo a la derecha, con «Aceptar», «Rechazar» y un enlace a la política. Está conectada a la API de privacidad de Shopify (`consent-tracking-api`), así que la elección del visitante es el consentimiento real que Shopify aplica a analíticas y marketing. Solo aparece a quien tiene que decidir (según la región y si ya eligió). **Desactiva el aviso propio de Shopify** en *Configuración → Privacidad del cliente* para no mostrar dos. Textos editables en *Personalizar → Aviso de cookies*.

## Envíos

**Regla comercial:** pedidos desde 60 € → envío gratis; por debajo, el cliente paga el envío que corresponda a su destino.

- **La regla real vive en Shopify**, no en el tema (tarifas de *Configuración → Envíos y entregas* o un descuento automático de envío gratis). El checkout es la fuente de verdad.
- El tema solo lo **comunica**: «Envío gratis desde 60 €» en la barra superior y en la ficha, y en el carrito lateral/página de carrito una barra de progreso («Te faltan X € para conseguir envío gratis» / «Has conseguido ENVÍO GRATIS»).
- La barra usa `cart.total_price` (después de los descuentos del carrito), en céntimos y sin redondear (59,95 € no llega a 60 €). Se oculta si el carrito está en otra moneda distinta al euro.
- El umbral se cambia en *Configuración del tema → Conversión → Envío gratis a partir de* y **debe coincidir** con la regla de Shopify.

## Menú y etiquetas (colecciones automáticas)

Cada colección se llena sola con las obras que lleven su etiqueta:

| Menú      | Colección (etiqueta) |
|-----------|----------------------|
| Obras     | Todas las obras · Novedades (`novedad`) · Más vendidos (automática) |
| Estilo    | Abstracto (`abstracto`) · Minimalista (`minimalista`) · Líneas (`lineas`) · Fotografía (`fotografia`) · Tipografía (`tipografia`) · Arquitectura (`arquitectura`) |
| Color     | Blanco y negro (`color-blanco-negro`) · Neutros (`color-neutro`) · Tonos cálidos (`color-calido`) · Tonos fríos (`color-frio`) · Multicolor (`color-multicolor`) |
| Tamaño    | Guía de tamaños · Formato vertical (`formato-vertical`) · Horizontal (`formato-horizontal`) · Cuadrado (`formato-cuadrado`) · Gran formato XL (`xl`) |
| Estancia  | Salón (`estancia-salon`) · Dormitorio (`estancia-dormitorio`) · Oficina (`estancia-oficina`) · Cocina (`estancia-cocina`) · Recibidor (`estancia-recibidor`) |
| Temática  | ver abajo |
| Ediciones | Noir (`noir`) · Cine (`cine`) · Silencio (`silencio`) · Ruido (`ruido`) · Edición limitada (`edicion-limitada`) |

## Tipos de obra (colecciones automáticas)

Etiqueta cada obra con su tipo y aparece sola en su colección y en el menú: `motor`, `sport`, `urban`, `animals`, `abstract`, `art`, `mindset`, `escape`.

## Material (ficha de producto)

Bloque «Material» debajo del botón de compra: Papel Premium Matte 200 g/m², acabado mate · giclée 12 colores · certificado FSC y tintas al agua. Marco opcional de madera maciza sostenible, listo para colgar. Editable en *Personalizar → Obra → Material*.

## Colecciones anteriores (automáticas por etiqueta)

Etiqueta cada obra y aparece sola en su colección:

| Colección           | Etiqueta        |
|---------------------|-----------------|
| Noir                | `noir`          |
| Cine                | `cine`          |
| Silencio            | `silencio`      |
| Ruido               | `ruido`         |
| Tienda XL           | `xl`            |
| Bellas Artes        | `bellas-artes`  |
| Impresiones en Tela | `tela`          |
| Marcos de Madera    | `marco-madera`  |

«Más vendidos» incluye todas las obras ordenadas por ventas; no necesita etiqueta.

## Cómo subir una obra

- **Imagen 1:** la obra sola. En los listados se muestra dentro de un marco negro (se desactiva en *Configuración del tema → Diseño*).
- **Imágenes siguientes:** fotos de ambiente, a sangre en la ficha de producto.
- **Variantes:** por ejemplo `Tamaño` y `Marco`; se muestran como botones.

## Estructura

```
layout/     theme.liquid, password.liquid
sections/   portada, secciones, colección destacada, texto, imagen con texto,
            compromisos, newsletter, cabecera, pie y páginas principales
snippets/   tarjeta de producto, precio, iconos, meta tags
templates/  plantillas JSON (inicio, producto, colección, carrito…)
assets/     base.css, theme.js (sin dependencias)
config/     ajustes del tema (colores, tipografía, diseño)
```

Revisado con Shopify Theme Check: 0 errores.
