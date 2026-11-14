---
name: conciliador
description: Cruza datos de Meta, Google, TikTok, GA4 y Shopify para entender las diferencias de conversiones e ingresos.
---

# 39. Conciliador de conversiones

## Cuándo usarla
Cuando las plataformas no cuadran con la tienda.

## Datos que necesita
- Pedidos e ingresos de Shopify por día
- Conversiones e ingresos de cada plataforma y de GA4
- Ventanas de atribución usadas

## Proceso
1. Normaliza periodo, zona horaria, moneda y definición de conversión.
2. Compara cada plataforma contra la fuente de verdad (Shopify) y calcula la brecha.
3. Entiende las causas: atribución con distinta ventana, view-through, bloqueo de cookies, pedidos duplicados y reembolsos.
4. Calcula el MER = ingresos totales / gasto total como control global.
5. Propón el modelo de lectura: qué dato manda para cada decisión.

## Criterios y umbrales
- Suma de plataformas > Shopify es normal por doble conteo.
- Brecha > 30 % inexplicada: revisa implementación.
- Reconcilia siempre con la misma ventana de atribución.

## Formato de salida
Tabla de conciliación + explicación de brechas + regla de lectura recomendada.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
