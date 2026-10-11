# Conectar «Tu imagen, impresa» con Gelato

Objetivo: que cuando alguien compre «Tu imagen, impresa», el pedido llegue a Gelato con la foto del cliente, sin hacerlo a mano.

Cómo funciona: la ficha ya guarda la foto que sube el cliente en el pedido, en la propiedad **`Imagen`** (un enlace de Shopify). Gelato puede leer ese enlace y usarlo como archivo de impresión si se lo decimos.

## Paso 1 · Decirle a Gelato dónde está la foto
Gelato → **Stores** → ARSNOIR → **Settings** → **Automatic processing of print files from apps**:
- Actívalo.
- En **Print file field name** escribe exactamente: `Imagen` (con I mayúscula).
- Guarda.

## Paso 2 · Aprobación manual para estos pedidos
Prometemos revisar y mejorar las fotos pequeñas antes de imprimir, así que estos pedidos **no** deben imprimirse solos.
En los ajustes de la tienda en Gelato, en **Order approval**, pon aprobación **manual** para los pedidos con la etiqueta de producto `personalizado` (o, si no deja por etiqueta, aprobación manual para todos los pedidos mientras empiezas) [CONFIRMAR en tu pantalla].
Así cada pedido se queda esperando: lo revisas, si hace falta cambias la foto por la mejorada con Topaz, y lo apruebas.

## Paso 3 · Conectar las 24 variantes
Gelato → **Stores** → ARSNOIR → productos **sin conectar** (Not connected) → «Tu imagen, impresa» → **Connect**.
Para cada variante elige el producto de Gelato de esta tabla (son los mismos que usan tus obras):

| Variante en Shopify | SKU | Producto de Gelato |
|---|---|---|
| A4 / Sin marco | CUSTOM-A4-SM | Premium Matte Paper Poster · 21×29,7 cm |
| A4 / Marco negro | CUSTOM-A4-MN | Wooden Framed Poster · 21×29,7 cm · Black frame |
| A4 / Marco blanco | CUSTOM-A4-MB | Wooden Framed Poster · 21×29,7 cm · White frame |
| A4 / Marco madera | CUSTOM-A4-MM | Wooden Framed Poster · 21×29,7 cm · Wood frame |
| A3 / Sin marco | CUSTOM-A3-SM | Premium Matte Paper Poster · A3 |
| A3 / Marco negro | CUSTOM-A3-MN | Wooden Framed Poster · A3 · Black frame |
| A3 / Marco blanco | CUSTOM-A3-MB | Wooden Framed Poster · A3 · White frame |
| A3 / Marco madera | CUSTOM-A3-MM | Wooden Framed Poster · A3 · Wood frame |
| A2 / Sin marco | CUSTOM-A2-SM | Premium Matte Paper Poster · A2 |
| A2 / Marco negro | CUSTOM-A2-MN | Wooden Framed Poster · A2 · Black frame |
| A2 / Marco blanco | CUSTOM-A2-MB | Wooden Framed Poster · A2 · White frame |
| A2 / Marco madera | CUSTOM-A2-MM | Wooden Framed Poster · A2 · Wood frame |
| 50×70 / Sin marco | CUSTOM-5070-SM | Premium Matte Paper Poster · 50×70 cm |
| 50×70 / Marco negro | CUSTOM-5070-MN | Wooden Framed Poster · 50×70 cm · Black frame |
| 50×70 / Marco blanco | CUSTOM-5070-MB | Wooden Framed Poster · 50×70 cm · White frame |
| 50×70 / Marco madera | CUSTOM-5070-MM | Wooden Framed Poster · 50×70 cm · Wood frame |
| A1 / Sin marco | CUSTOM-A1-SM | Premium Matte Paper Poster · A1 |
| A1 / Marco negro | CUSTOM-A1-MN | Wooden Framed Poster · A1 · Black frame |
| A1 / Marco blanco | CUSTOM-A1-MB | Wooden Framed Poster · A1 · White frame |
| A1 / Marco madera | CUSTOM-A1-MM | Wooden Framed Poster · A1 · Wood frame |
| XL / Sin marco | CUSTOM-XL-SM | Premium Matte Paper Poster · 60×90 cm |
| XL / Marco negro | CUSTOM-XL-MN | Wooden Framed Poster · 60×90 cm · Black frame |
| XL / Marco blanco | CUSTOM-XL-MB | Wooden Framed Poster · 60×90 cm · White frame |
| XL / Marco madera | CUSTOM-XL-MM | Wooden Framed Poster · 60×90 cm · Wood frame |

Si Gelato pide un diseño al conectar, sube cualquier imagen vertical de ejemplo: en cada pedido se usará la foto del cliente (paso 1).
Al conectar, **no cambies precios ni títulos** en Gelato: los de Shopify ya están bien (v8).

## Paso 4 · Probar
Haz un pedido de prueba (A4 sin marco, lo más barato) subiendo una foto. En Gelato → Orders debe aparecer el pedido **con tu foto** y esperando aprobación. Si aparece sin foto, avísame y miro con la API qué ha llegado.

Fuente: [Gelato · ¿Se pueden procesar automáticamente los archivos de impresión de apps de Shopify?](https://support.gelato.com/en/articles/8996437-can-print-files-from-shopify-apps-be-automatically-processed-by-gelato)
