---
name: limites-guardrails
description: Define reglas para escalar con control: límites de gasto, alertas y criterios de pausa.
---

# 36. Límites y guardrails

## Cuándo usarla
Al montar la operación de una cuenta o automatizar decisiones.

## Datos que necesita
- Objetivos (CPA/ROAS), presupuesto, riesgos del cliente

## Proceso
1. Define límites duros: gasto máximo diario/mensual, CPA máximo aceptable y mínimo de ROAS.
2. Define alertas: desviación de gasto, caída de conversiones, subida de CPM.
3. Crea reglas: «si CPA > X durante Y días con gasto ≥ Z, pausar o revisar».
4. Asigna responsables y acciones para cada alerta.
5. Establece cadencia de revisión.

## Criterios y umbrales
- Las reglas deben tener umbral, ventana y acción.
- Evita reglas automáticas que pausen por ruido (muestras pequeñas).
- Documenta excepciones: eventos y lanzamientos.

## Formato de salida
Tabla de reglas: condición | ventana | acción | responsable | prioridad.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
