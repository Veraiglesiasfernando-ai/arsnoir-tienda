---
name: control-tracking
description: Verifica que todo el tracking mide correctamente end-to-end.
---

# 42. Control de tracking

## Cuándo usarla
Tras cambios en la tienda, tema, consentimiento o campañas.

## Datos que necesita
- Acceso a la tienda y a las plataformas
- Pedido de prueba posible

## Proceso
1. Realiza un recorrido de prueba: visita, producto, carrito, checkout, compra de prueba.
2. Comprueba que cada plataforma recibe cada evento con sus parámetros.
3. Revisa la gestión del consentimiento (Consent Mode) y su efecto en datos.
4. Compara ingresos de prueba con los registrados.
5. Documenta lo que falla y quién lo corrige.

## Criterios y umbrales
- Prueba en móvil y escritorio.
- Verifica en modo incógnito y con consentimiento aceptado y rechazado.
- Repite la verificación tras cada cambio de tema o app.

## Formato de salida
Checklist con estado OK/Fallo por evento y plataforma, y plan de corrección.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
