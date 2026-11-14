---
name: monitor-pacing
description: Revisa el gasto real frente al plan y avisa de desviaciones a tiempo.
---

# 32. Monitor de pacing

## Cuándo usarla
A diario o semanalmente para cada cuenta con presupuesto mensual.

## Datos que necesita
- Presupuesto mensual y por canal/campaña
- Gasto acumulado y días transcurridos
- Calendario de eventos (BF, rebajas)

## Proceso
1. Calcula gasto esperado a la fecha = presupuesto × (días transcurridos / días del mes), ajustando por estacionalidad.
2. Calcula desviación % y la proyección de cierre al ritmo actual.
3. Detecta causas: subida de CPM, aumento de puja, presupuestos no consumidos o campañas pausadas.
4. Define ajuste: bajar/subir presupuesto diario necesario para llegar al objetivo.
5. Avisa del riesgo de subgasto en campañas con límites de entrega.

## Criterios y umbrales
- Desviación > ±10 %: ajustar; > ±20 %: alerta.
- Considera que Meta puede gastar hasta 25 % más un día concreto.
- Revisa cuentas con facturación en otras monedas (conversión).

## Formato de salida
Tabla por cuenta/campaña: plan | gasto | desviación % | proyección | ajuste diario necesario | alerta.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
