---
name: veredicto-conjunto
description: Da un veredicto claro por conjunto de anuncios de Meta: escalar, mantener, pausar o iterar. Úsala cuando haya que decidir qué hacer con cada ad set.
---

# 02. Veredicto de conjunto

## Cuándo usarla
En cualquier revisión de cuenta donde haya que decidir qué conjuntos reciben más, igual o menos presupuesto.

## Datos que necesita
- Datos por conjunto: gasto, compras, CPA/ROAS, CPM, CTR, frecuencia, fase de aprendizaje, días activo
- Objetivo de CPA/ROAS y margen del cliente
- Presupuesto actual y límite de gasto mensual

## Proceso
1. Comprueba primero que el conjunto salió de la fase de aprendizaje y acumula ≥ 50 eventos de optimización o ≥ 3x CPA de gasto.
2. Compara el CPA/ROAS del conjunto contra el objetivo y contra la media de la campaña.
3. Revisa la calidad del resultado: AOV, ratio de nuevos clientes y tendencia de los últimos 7 días frente a los 14 anteriores.
4. Aplica la matriz de decisión y emite un veredicto con una sola razón principal y una acción numérica.
5. Señala riesgos: dependencia de un único anuncio, audiencia pequeña, frecuencia alta.

## Criterios y umbrales
- Escalar: ROAS ≥ 1,2x objetivo durante 5+ días y gasto estable; subir 15-20 % cada 3 días.
- Mantener: dentro de ±15 % del objetivo; no tocar, esperar datos.
- Iterar: buen CTR pero mala conversión (revisar landing y oferta) o mala conversión de audiencia.
- Pausar: CPA > 1,5x objetivo con gasto ≥ 3x CPA objetivo y sin mejora de tendencia.
- Sin veredicto: aprendizaje o muestra insuficiente; indica cuántos días/eventos faltan.

## Formato de salida
Una fila por conjunto: nombre | veredicto | razón (1 frase) | acción con cifra. Cierra con el impacto estimado en presupuesto reasignado.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
