# Paso de Gelato a merchOne (11/11/2026)

Decisión del dueño: pasar toda la tienda de Gelato a merchOne. Gelato se queda **de reserva** hasta que merchOne esté probado.

## Estado de merchOne
- Cuenta creada. Facturación y billetera hechas (50 € de saldo). Sin número de IVA, así que merchOne cobra **19 % de IVA alemán** en cada pedido.
- Tienda **ARSNOIR** (Shopify): conectada; servicio de envío «merchOne» (handle `picanova`, ubicación `gid://shopify/Location/120340545920`); 0 productos asignados.
- Tienda **ARSNOIR-API** (integración personalizada): activa; pedidos en «Manualmente».
- API: `https://api.merchone.com/api/v1`, autenticación **Basic** (API user + API key). La clave está guardada como secreto de red en el entorno **Default** (host `api.merchone.com`), así que nunca aparece en el chat ni en el repositorio.
  - En la sesión del 11/11 la API devolvía **403** en todas las rutas. Hay que probarla en una sesión nueva. Si sigue el 403, revisar que el API user sea el exacto.
  - Rutas: `/blueprints`, `/blueprints/{id}/variants`, `/blueprints/{id}/variants/{variant}/options` (SKU y precio), pedidos (`product_sku` + URL del archivo de impresión), biblioteca y tarifas de envío.
- Envío sin marca (white label): sin logo de merchOne en el paquete y en el albarán. Se puede poner un logo en la trasera de los lienzos (logo cuadrado `arsnoir` hecho en la sesión).

## Precios vistos en el panel (sin IVA, envío a España)
| Producto | Tamaño | Producto | Envío primero / adicional |
|---|---|---|---|
| Cartel | 18×13 | 2,76 | 6,99 / 1,99 |
| Cartel | 30×20 | 3,32 | 6,99 / 1,99 |
| Cartel | 40×30 | 4,22 | 6,99 / 1,99 |
| Cartel | 45×30 | 4,74 | 6,99 / 1,99 |
| Cartel | 50×40 | 6,09 | 6,99 / 1,99 |
| Cartel | 50×50 | 6,76 | 6,99 / 1,99 |
| Cartel | 70×50 | 7,26 | 6,99 / 1,99 |
| Cartel | 91×61 | 6,12 (¿otro papel? [CONFIRMAR]) | 6,99 / 1,99 |
| Cartel | 100×70 | 13,86 | 6,99 / 1,99 |
| Cartel | 60×20 | 5,76 | 6,99 / 1,99 |
| Cartel | 60×40 y 80×60 | existen, precio sin ver | |
| Póster enmarcado | 30×20 | 10,70 | 6,99 / 1,99 |
| Póster enmarcado | 40×30 | 12,12 | 6,99 / 1,99 |
| Póster enmarcado | 60×40 | 24,35 | 10,99 / 2,50 |
| Póster enmarcado | 80×60 | 37,64 | 10,99 / 2,50 |
| Lienzo | 30×20 | 10,92 | 3,99 / 0,99 |
| Lienzo | 40×20 | 12,78 | 3,99 / 0,99 |
| Lienzo | 40×30 | 18,93 | 3,99 / 0,99 |
| Lienzo | 40×40 | 20,88 | 3,99 / 0,99 |
| Lienzo | 60×20 | 13,59 | 3,99 / 0,99 |
| Lienzo | 60×30 | 19,63 | 3,99 / 0,99 |

## Propuesta de tamaños (sin aprobar)
- Láminas: 30×20, 40×30, 60×40, 70×50, 80×60, 100×70.
- Con marco: 30×20, 40×30, 60×40, 80×60 (merchOne no tiene más).
- Las obras están en formato A (proporción 1,41). 70×50 y 100×70 encajan; las demás recortan un poco, así que hay que revisar el recorte obra por obra.
- Precios de venta propuestos (sin aprobar):
  - Lámina: 24,95 / 29,95 / 49,95 / 59,95 / 69,95 / 84,95.
  - Marco: 54,95 / 69,95 / 79,95 / 104,95.
- **No cambiar precios ni tamaños sin el «dale» del dueño.**

## Plan
1. Muestra (lienzo 40×30 a casa del dueño).
2. API funcionando, con todos los precios y SKU.
3. Tabla final de tamaños y precios; el dueño la aprueba.
4. Una obra de prueba conectada a merchOne y un pedido de prueba.
5. Las 55 obras. Los 16 retratos personalizados, de momento con pedidos manuales en merchOne (imagen ampliada antes); más adelante automáticos por la API desde el Worker.
6. Quitar Gelato (app y bloque de personalización en el tema) cuando todo funcione.
7. MIXPIX (cuadrados de 20×20 adhesivos) en enero para los retratos, sueltos y en pack.

## Precios por la API (11/11/2026, sin IVA, sin envío)
La API ya funciona (200) con el secreto del entorno Default.
- **Póster (blueprint 47) tiene tamaños DIN A**, así que las obras no se recortan:

  | Tamaño | Precio | Variante |
  |---|---|---|
  | A4 | 3,35 | 480 |
  | A3 | 5,68 | 479, SKU PSD0420291 |
  | A2 | 6,93 | 478 |
  | A1 | 9,84 | 477 |
  | A0 | 17,90 | 476 |

  Además: 70×50 7,26 · 100×70 13,86 · 60×40 6,89 · 80×60 9,58 · 90×60 10,82.
- **Póster enmarcado (58)**: solo 30×20 (10,70), 40×30 (12,12), 60×40 (24,35) y 80×60 (37,64). Marcos Deco negro, blanco, plata, nogal y roble al mismo precio; con colgador +1 €. No hay tamaños A.
- **Lienzo (2)**, sin marco, borde espejo 2 cm:

  | Tamaño | Precio |
  |---|---|
  | 30×20 | 6,69 |
  | 40×30 | 14,89 |
  | 60×40 | 20,53 |
  | 80×60 | 29,42 |
  | 90×60 | 32,04 |

  Con marco flotante negro: 14,90 / 25,88 / 36,61 / 49,16 / 55,31. La API da precios más bajos que el panel (40×30: 14,89 frente a 18,93) [CONFIRMAR].
- **MixPix (34)**: 20×20, 5,64.
- Envío visto en el panel:
  - lienzo 3,99 (+0,99 cada adicional);
  - póster 6,99 (+1,99);
  - enmarcado 6,99 (+1,99) los pequeños y 10,99 (+2,50) los grandes.

## Catálogo completo (API, sin IVA, sin envío)
- **Lienzo**, sin marco / con marco flotante:

  | Tamaño | Sin marco | Con marco flotante |
  |---|---|---|
  | 20×20 | 4,33 | 11,78 |
  | 30×20 | 6,69 | 14,90 |
  | 40×30 | 14,89 | 25,88 |
  | 40×40 | 16,30 | 29,02 |
  | 60×40 | 20,53 | 36,61 |
  | 75×50 | 25,46 | 44,47 |
  | 80×60 | 29,42 | 49,16 |
  | 90×60 | 32,04 | 55,31 |
  | 100×75 | 50,02 | 78,96 |
  | 120×80 | 57,40 | 104,22 |

  - Marcos: negro, blanco, plata, nogal, roble y pino.
  - Bordes: espejo, doblado, blanco o negro; 2 o 4 cm.
- **MixPix 20×20**: sin marco 5,64; con marco blanco o negro 7,75. También versión MAGNOFIX, mismo precio.
- El JSON completo está en el scratchpad de la sesión (no está en el repositorio). Para regenerarlo: `GET /blueprints/{2,47,58,34}/variants` y `.../options`.

## Decisiones del dueño (11/11/2026)
- **Láminas**: mismos tamaños A (A4, A3, A2, A1). 50×70 pasa a 70×50 y 60×90 a 91×61 o 100×70 [decidir]. **Mismos precios de venta que ahora.**
- **Póster con marco**: 30×20, 40×30, 60×40 y 80×60, con **margen blanco** alrededor (la obra entera, sin recortar).
- **Lienzo** (sin marco y con marco flotante): 40×30, 60×40 y 80×60 en lugar de 30×40, 45×60 y 60×80, **con los mismos precios de venta**.

## Lo que bloquea el paso de las obras
- **Faltan los archivos originales en alta resolución.**
  - En Shopify solo hay imágenes de muestra («-obra.jpg», unos 1390×1972 px, de unos 118 ppp en A3). No sirven para A2 ni A1.
  - La API de Gelato solo da vistas previas («preview»), no los archivos de impresión.
  - El dueño tiene que pasar los originales: carpeta de Drive, Canva o donde los creó.
- **Cómo funcionarían los pedidos (propuesta):**
  - Shopify se queda con sus productos.
  - Cada variante lleva el SKU de merchOne en un metafield.
  - El Worker recibe el webhook de pedido pagado y crea el pedido en la API de merchOne (`product_sku` + URL del archivo de impresión).
  - Los pedidos se quedan en «manual» hasta revisarlos. No hace falta ninguna app de pago.
- El texto de las fichas dice «200 g/m²» (el papel de Gelato). Con merchOne hay que poner «Papel fotográfico Fujifilm mate» hasta confirmar el gramaje.

## Sesión siguiente (11/11/2026): tabla de SKU
- La API sigue funcionando (200).
- Correspondencia variante de Shopify → SKU de merchOne en `data/merchone-skus.json`.
  - Láminas: A4, A3, A2, A1 y 70×50 ya tienen SKU, con los mismos precios de venta.
  - Lienzo: «Slim» = bastidor 2 cm y «Thick» = bastidor 4 cm. 30×40 → 40×30, 45×60 → 60×40, 60×80 → 80×60.
  - Lienzo con marco flotante (solo bastidor 2 cm): negro y, para «Wood frame», roble [CONFIRMAR color].
- **Resuelto el [CONFIRMAR] del lienzo:** el panel enseña el bastidor de 4 cm (40×30 = 18,93) y la API lista primero el de 2 cm (14,89). No es una diferencia de precio.
- Aviso: los tamaños de merchOne vienen en horizontal (p. ej. 40×30). Hay que comprobar en el pedido de prueba que acepta el archivo en vertical [CONFIRMAR].

## Falta que decida el dueño
1. **Dónde están los originales en alta resolución.** Sigue siendo lo que bloquea. En el repositorio solo hay imágenes de muestra (`media/products/*-obra.jpg`, ~900–1400 px de ancho).
2. Lámina 60×90 → ¿100×70 (coste 13,86, misma proporción que las obras, no recorta) o 91×61 (6,12, recorta)? Recomendación: **100×70**.
3. Lienzo 20×25 (con y sin marco): merchOne no lo tiene. ¿Quitarlo o pasarlo a 30×20?
4. Póster con marco: hoy hay 6 tamaños y merchOne tiene 4. Qué tamaño va a cuál y a qué precio.
5. Color del marco «Wood»: roble, nogal o pino.

## Originales (11/11/2026)
Recibidos en Drive. Análisis completo en `docs/merchone-originales.md`: 36 de las 54 obras tienen original y ninguna necesita ampliarse. Faltan 18 (lista en ese documento).
La API de pedidos (`POST /orders`) pide `is_test` y `shipping_type`; los valores válidos de `shipping_type` no salen probando. Hace falta la documentación de la API (merchone.com no está permitido en la red de la sesión) [CONFIRMAR].

## MIXPIX en los retratos (11/11/2026)
- Envío de MIXPIX visto en el panel: **6,99 €** a España.
- Coste por la API (blueprint 34, sin IVA): sin marco 5,64 €; con marco blanco o negro 7,75 €.
- Precios de venta aprobados por el dueño:

  | | Suelto | Pack de 2 | Pack de 3 | Pack de 6 |
  |---|---|---|---|---|
  | Sin marco | 24,95 | 39,95 | 54,95 | 99,95 |
  | Con marco (negro o blanco) | 29,95 | 49,95 | 69,95 | 124,95 |

- **Hecho en Shopify:** los 16 retratos de mascota, pareja y familia tienen 12 variantes nuevas: Tamaño «MIXPIX 20×20 · suelto / pack de 2 / pack de 3 / pack de 6» × Acabado «Sin marco / Marco negro / Marco blanco».
  - SKU = SKU de merchOne + `-P{n}` (unidades del pack): `MPS0200201-P3` (sin marco), `MPS0200201MB-P3` (marco negro), `MPS0200201MW-P3` (marco blanco).
  - Pedido en merchOne: n unidades del SKU base, una por estilo.
- **Pack = la misma mascota (o pareja o familia) en varios estilos.** En la ficha, al elegir un pack, el cliente marca los estilos (`snippets/mixpix-styles.liquid`). El estilo de la página es el primero. Llegan al pedido como propiedad «Estilos del pack». Mientras hay un pack elegido se oculta el «2 obras −15 %».
- Pestaña «Pack MIXPIX» en «Compón tu pared» de la portada (`sections/pet-packs.liquid`, bloque `mixpix`, `snippets/mixpix-pack-panel.liquid`). Los precios salen de las variantes, no van escritos a mano.
- Pedidos de MIXPIX: **a mano en merchOne** (Gelato no los sirve). Margen más justo: pack de 6 sin marco con envío de 6,99 € por unidad, unos 17 €; si es 6,99 € por pedido, unos 52 €. [CONFIRMAR si el envío es por pedido o por unidad]
