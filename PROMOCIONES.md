# ARSNOIR — Promociones

El tema solo **muestra** las promociones (barras, pop-up, selector de regalo). Quien cobra y descuenta es Shopify, así que cada regla tiene que existir también en el admin. Esta es la lista de lo que hay que crear y cómo encaja con el tema.

| Promoción | Dónde vive la regla real | Dónde la refleja el tema |
|-----------|--------------------------|--------------------------|
| Envío gratis ≥ 60 € | Configuración → Envíos y entregas | Barra de anuncio, barra del carrito, ficha de producto (*Configuración del tema → Conversión → Envío gratis a partir de* = 60) |
| ARSNOIR10 (10 %, primera compra) | Descuentos → código | Pop-up de entrada (*Personalizar → Pop-up 10% primera compra*) |
| Lámina A4 de regalo (80 € / 140 €) | Descuentos → 2 descuentos automáticos «Compra X, llévate Y» | Barra de regalo y «Elige tu lámina A4 de regalo» (*Configuración del tema → Carrito: regalo, pack y bienvenida*) |

## 1. Envío gratis desde 60 €

Regla fija de la tienda, no es un descuento.

*Configuración → Envíos y entregas → perfil general → cada zona (España, Europa)*:

1. Tarifa de pago (la que cobres hoy) con condición **precio del pedido de 0 € a 59,99 €**.
2. Tarifa **Envío gratis, 0 €**, con condición **precio del pedido desde 60 €**.

Al ser una tarifa y no un descuento, es compatible con todo lo demás sin tocar nada.

## 2. ARSNOIR10 — 10 % en la primera pieza

*Descuentos → Crear descuento → Importe de descuento en productos* (o «en el pedido»):

- Código: `ARSNOIR10`
- Valor: 10 %
- Se aplica a: todos los productos
- Elegibilidad: todos los clientes
- Usos máximos: **limitar a un uso por cliente**
- Primera compra: marca **«Solo para la primera compra del cliente»** si tu admin lo ofrece; si no, déjalo en un uso por cliente (en la práctica el código solo llega a quien se suscribe desde el pop-up).
- Combinaciones: **no** marques «descuentos de productos» ni «descuentos de pedido». Sí puede combinar con **descuentos de envío** (el envío gratis es una tarifa, así que no afecta).
- Fechas: desde hoy, sin fecha de fin.

El pop-up ya viene con este código por defecto. Los emails se guardan en *Clientes* con las etiquetas `newsletter` y `popup`; si usas Klaviyo o Shopify Email, crea el flujo de bienvenida con esa etiqueta para reenviar el código por email.

## 3. Lámina A4 sin marco de regalo

El cliente elige la lámina en el carrito; el tema la añade con la propiedad oculta `_regalo` en el tamaño **21 × 29,7 sin marco**. El precio 0 € lo pone Shopify con dos descuentos automáticos. Los tramos no se suman: a partir de 140 € son 2 en total.

Antes: crea (o revisa) la colección de láminas elegibles y selecciónala en *Configuración del tema → Carrito → Obras que se pueden elegir de regalo*.

*Descuentos → Crear descuento → Compra X y llévate Y*, **automático**, dos veces:

| | Regalo 80 € | Regalo 140 € |
|--|--|--|
| Título | Lámina A4 de regalo | 2 láminas A4 de regalo |
| El cliente gasta | Importe mínimo de compra **80 €** | Importe mínimo de compra **140 €** |
| En | Colección de obras (sin los regalos) | Igual |
| El cliente obtiene | **1** artículo de la colección de regalo | **2** artículos de la colección de regalo |
| Descuento | Gratis | Gratis |
| Usos máximos por pedido | 1 | 1 |
| Combinaciones | Ninguna (solo envío) | Ninguna (solo envío) |

Notas:

- Si la app o el tipo de descuento no permite restringir «llévate Y» a la variante A4 sin marco, usa una colección que solo contenga esas variantes (o una app tipo «Free gift / BOGO») para que nunca salga gratis un tamaño mayor.
- Los dos regalos no se combinan entre sí; con 140 € o más Shopify aplica el que más ahorra (el de 2 láminas).
- Los umbrales del tema tienen que coincidir: *Configuración del tema → Carrito → 1 obra de regalo desde* = 80 y *2 obras de regalo desde* = 140.

## 4. Acumulación

- **Envío gratis** → compatible con todo (es tarifa de envío).
- **ARSNOIR10** ↔ **regalo** → no combinan: lo garantiza la configuración de combinaciones de los descuentos de arriba. El tema además:
  - quita la lámina de regalo si hay un código aplicado y Shopify ya no la deja a 0 €, y avisa «Tu código de descuento no se combina con la lámina de regalo: usa uno u otro»;
  - no aplica ARSNOIR10 automáticamente al suscribirse si el carrito ya tiene una lámina de regalo (el cliente puede meterlo en el pago si lo prefiere).
- **Pack de 2** (descuento automático ya existente, 15 %): la especificación no lo menciona. Para proteger margen conviene que tampoco combine con el regalo ni con ARSNOIR10. El tramo del regalo se calcula con el total **después** del pack, así que el pack no permite llegar a 80 € «en falso».

## 5. Comprobación de margen

Coste de cada lámina A4 de regalo: ~11 € (producción + envío Gelato). Peores casos permitidos:

| Carrito | Ingreso | Coste extra promo |
|---------|---------|-------------------|
| 59,99 € con ARSNOIR10 | 54 € | envío pagado por el cliente |
| 60 € con ARSNOIR10 | 54 € | envío gratis |
| 80 € con regalo (sin código) | 80 € | 1 lámina (~11 €) + envío gratis |
| 140 € con regalo (sin código) | 140 € | 2 láminas (~22 €) + envío gratis |

Hay que confirmar con los costes reales de Gelato de cada pedido (obras + envío) que esos cuatro carritos siguen en positivo. El caso más ajustado suele ser el de **80 € con una sola obra grande enmarcada**, porque el coste de producción de la obra más la lámina más el envío gratis caen todos en el mismo pedido.
