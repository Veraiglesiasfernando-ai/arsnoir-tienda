---
name: deteccion-gaps-eventos
description: Encuentra eventos faltantes en pixel, CAPI, GA4 y Google Ads.
---

# 41. Detección de gaps de eventos

## Cuándo usarla
En auditorías o cuando caen las señales de optimización.

## Datos que necesita
- Lista de eventos recibidos con volumen
- Funnel de la tienda (view content, add to cart, checkout, compra)
- Estado de CAPI y calidad de coincidencia

## Proceso
1. Mapea el funnel estándar de e-commerce y compara con los eventos recibidos.
2. Detecta eventos ausentes, duplicados o con parámetros incompletos (value, currency, content_ids).
3. Verifica deduplicación entre pixel y CAPI mediante event_id.
4. Revisa coincidencia de datos de cliente (email, teléfono hasheados).
5. Prioriza correcciones por impacto en optimización.

## Criterios y umbrales
- Sin value y currency en compra, la puja por valor no funciona.
- Cobertura de CAPI > 90 % de los eventos del navegador es la referencia.
- Los eventos duplicados inflan conversiones.

## Formato de salida
Matriz de eventos: evento | pixel | CAPI | GA4 | parámetros | estado | acción.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
