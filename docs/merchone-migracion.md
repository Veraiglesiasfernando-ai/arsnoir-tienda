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
