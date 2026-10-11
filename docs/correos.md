# Correos ARSNOIR: textos para copiar

Dónde se cambian:
- **Pedido y envío**: Ajustes → Notificaciones → (el correo) → Editar código. Cambia el **Asunto** y, en el cuerpo, solo el texto de bienvenida de arriba (el que dice «¡Gracias por tu compra!» o parecido). El resto de la plantilla no se toca.
- **Carrito abandonado y bienvenida**: Marketing → Automatizaciones → (la automatización) → editar el correo.

Lo que está entre `{{ }}` lo rellena Shopify solo (nombre, número de pedido…). Cópialo tal cual.

Firma común para todos:
> El equipo de ARSNOIR
> arsnoir.com

---

## 1. Confirmación de pedido

**Asunto:** `Confirmación de tu pedido {{ order.name }}`

**Texto:**
> Hola, {{ customer.first_name }}:
>
> Gracias por confiar en ARSNOIR. Hemos recibido tu pedido correctamente y ya estamos preparándolo.
>
> Cada obra se imprime bajo pedido, de forma exclusiva para ti. En cuanto tu pedido salga hacia tu dirección, te enviaremos un correo con el número de seguimiento.
>
> A continuación encontrarás el resumen de tu compra.

## 2. Pedido enviado

**Asunto:** `Tu pedido {{ order.name }} ha sido enviado`

**Texto:**
> Hola, {{ customer.first_name }}:
>
> Tu pedido ya está en camino. Puedes consultar su estado en cualquier momento con el enlace de seguimiento que encontrarás más abajo.
>
> Las obras enmarcadas viajan en una caja plana de cartón rígido, con una funda interior que protege el marco. Para abrirla, basta con tirar de la tira de apertura: no necesitas cúter ni tijeras.
>
> Esperamos que la disfrutes.

## 3. Carrito abandonado

**Asunto:** `Tu selección te espera`

**Texto:**
> Hola:
>
> Hemos guardado la obra que dejaste en tu carrito para que puedas finalizar tu compra cuando lo desees.
>
> Todas nuestras obras se imprimen bajo pedido. El envío es gratuito a partir de 80 €.

**Botón:** `Finalizar compra`

## 4. Bienvenida a la newsletter

**Asunto:** `Bienvenido a ARSNOIR`

**Texto:**
> Hola:
>
> Gracias por suscribirte. A partir de ahora serás de los primeros en conocer nuestras nuevas obras y colecciones.
>
> Como bienvenida, te ofrecemos un 10 % de descuento en tu primera compra con el código:
>
> **WELCOME10**
>
> Póster o lienzo, con o sin marco. Envío gratuito a partir de 80 €.

**Botón:** `Descubrir las obras` → enlace a la colección Obras.

---

No pongas plazos de entrega concretos hasta confirmarlos con Gelato [CONFIRMAR].
