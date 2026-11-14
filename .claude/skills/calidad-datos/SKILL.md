---
name: calidad-datos
description: Evalúa la fiabilidad de las conversiones y métricas antes de tomar decisiones.
---

# 43. Calidad de datos

## Cuándo usarla
Antes de informes o decisiones de presupuesto basadas en datos dudosos.

## Datos que necesita
- Series temporales de conversiones por plataforma
- Cambios recientes de tracking o tienda

## Proceso
1. Busca roturas de serie: caídas o subidas bruscas sin causa comercial.
2. Mide la consistencia entre plataformas y con Shopify en el tiempo.
3. Detecta duplicados, pedidos de prueba, reembolsos y fraude.
4. Asigna una puntuación de fiabilidad por fuente.
5. Indica qué decisiones se pueden tomar y cuáles esperar.

## Criterios y umbrales
- Cambios de ±40 % de un día a otro: investiga antes de actuar.
- Excluye periodos corruptos de los análisis.
- Decide con la fuente más fiable, no con la más favorable.

## Formato de salida
Informe de fiabilidad por fuente con puntuación, incidencias y decisiones permitidas.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
