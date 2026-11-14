---
name: utms-check
description: Detecta enlaces rotos o mal etiquetados que ensucian la atribución.
---

# 40. Revisión de UTMs

## Cuándo usarla
En auditorías de tracking o al lanzar campañas.

## Datos que necesita
- Lista de URLs de anuncios con parámetros
- Informe de tráfico por fuente/medio/campaña en GA4

## Proceso
1. Comprueba la plantilla: utm_source, utm_medium, utm_campaign, utm_content y utm_term cuando aplica.
2. Detecta inconsistencias: mayúsculas, espacios, fuentes duplicadas (fb, facebook, meta).
3. Busca tráfico en «(not set)», «direct» o «unassigned» sospechoso.
4. Revisa redirecciones que pierdan parámetros y enlaces rotos.
5. Propón una nomenclatura única y plantilla de parámetros dinámicos por plataforma.

## Criterios y umbrales
- Todo en minúsculas y sin espacios.
- Usa parámetros dinámicos de plataforma ({{campaign.name}}, {campaign_id}).
- Un anuncio sin UTMs es tráfico perdido para la medición.

## Formato de salida
Lista de errores por URL/campaña, nomenclatura estándar y plantilla de UTMs por plataforma.

## Reglas
- No inventes datos: si falta una métrica, pídela o márcala como «no disponible» antes de concluir.
- Los umbrales de esta skill son puntos de partida para e-commerce (España y mercados fuertes); calíbralos con el histórico de la cuenta (AOV, margen, ciclo de compra).
- Prioriza siempre por impacto en euros (gasto en juego o ingresos recuperables), no por orden de aparición.
- Termina con acciones concretas: qué hacer, dónde, con qué cifra y en qué plazo. Una conclusión sin acción no cuenta.
- Sé crítico: si los datos no permiten concluir (muestra pequeña, ventana de aprendizaje, atribución dudosa), dilo y propón qué medir.
