# Correos ARSNOIR: textos para copiar

Dónde se cambian:
- **Pedido y envío**: Ajustes → Notificaciones → (el correo) → Editar código. Cambia el **Asunto** y, en el cuerpo, solo el texto de bienvenida de arriba (el que dice «¡Gracias por tu compra!» o parecido). El resto de la plantilla no se toca.
- **Carrito abandonado y bienvenida**: Marketing → Automatizaciones → (la automatización) → editar el correo.

Lo que está entre `{{ }}` lo rellena Shopify solo (nombre, número de pedido…). Cópialo tal cual.

---

## 1. Confirmación de pedido

**Asunto:** `Tu pedido {{ order.name }} está confirmado`

**Texto:**
> Gracias, {{ customer.first_name }}.
> Hemos recibido tu pedido. Cada obra se imprime bajo pedido, solo para ti. Cuando salga hacia tu casa te mandamos el número de seguimiento.

## 2. Pedido enviado

**Asunto:** `Tu obra ya va de camino`

**Texto:**
> {{ customer.first_name }}, tu pedido {{ order.name }} ya está en camino.
> Abajo tienes el enlace de seguimiento. Si llega con marco, viene en una caja plana: se abre por la tira, sin cúter ni tijeras.

## 3. Carrito abandonado

**Asunto:** `Tu obra sigue esperándote`

**Texto:**
> Has dejado una obra en el carrito. La hemos guardado para que la termines cuando quieras.
> Envío gratis a partir de 80 €.

**Botón:** `Volver al carrito`

## 4. Bienvenida a la newsletter

**Asunto:** `Bienvenido a ARSNOIR: tu 10 %`

**Texto:**
> Gracias por unirte.
> Aquí tienes tu código de bienvenida para tu primera compra: **WELCOME10** (10 % de descuento).
> Póster o lienzo, con o sin marco. Envío gratis a partir de 80 €.

**Botón:** `Ver las obras` → enlace a la colección Obras.

---

No pongas plazos de entrega concretos hasta confirmarlos con Gelato [CONFIRMAR].
