# Plantillas con Replicate: cómo activarlas

Cómo funciona:

1. En la ficha de la plantilla, el cliente sube su foto y escribe el nombre si la plantilla lo lleva. Pulsa «Ver mi ilustración».
2. La tienda manda la foto a **tu intermediario** (un Cloudflare Worker).
3. El intermediario pide la ilustración a **Replicate** con tu clave. La clave nunca está en la tienda.
4. El cliente ve la vista previa. Sin vista previa no puede añadir al carrito.
5. En el pedido queda guardado:
   - `_Ilustración`: el enlace de la imagen.
   - `Plantilla`.
   - `Nombre`.
   - `Derechos de imagen`.
6. **Tú** descargas la ilustración y la amplías a alta calidad (Replicate o Upscayl). Luego haces el pedido a mano en Gelato con la dirección del cliente.

Productos ya creados en Shopify, **en borrador** y **sin conectar a Gelato**, con los precios v8:

| Producto | Plantilla del intermediario | Ficha (plantilla del tema) |
|---|---|---|
| Retrato con nombre | `retrato-con-nombre` → `retrato-nombre` | `product.ilustracion` |
| Acuarela en casa | `acuarela-en-casa` → `acuarela-familia` | `product.ilustracion-familia` |

Mientras no pongas la URL del intermediario, la ficha dice «Muy pronto» y no deja comprar.

---

## 1. Replicate

1. Crea una cuenta en replicate.com y añade saldo (Billing).
2. Ve a **Account → API tokens** y crea un token. **No lo pegues en ningún chat ni en el tema.**
3. Modelo que usamos: `google/nano-banana`. Acepta varias imágenes: la plantilla y la foto del cliente.
   - Revisa en su página el precio por imagen y que permita uso comercial [CONFIRMAR].
   - Si prefieres otro modelo, se cambia en `MODEL` (wrangler.toml). Puede que haya que ajustar los campos del `input` en `worker.js`.

## 2. Cloudflare (intermediario)

1. Crea una cuenta gratis en cloudflare.com.
2. En tu ordenador, con Node instalado, ejecuta esto dentro de `workers/plantillas`:
   ```
   npx wrangler login
   npx wrangler secret put REPLICATE_API_TOKEN     # pega aquí el token de Replicate
   ```
3. Edita `wrangler.toml`. En `ALLOWED_ORIGINS` pon los dominios de tu tienda, separados por comas: tu dominio y el `xxxx.myshopify.com`.
4. **Copias permanentes (recomendado).** Los enlaces de Replicate caducan en más o menos 1 hora y el pedido necesita uno que dure:
   - `npx wrangler r2 bucket create arsnoir-plantillas`
   - En Cloudflare → R2 → el bucket → Settings → activa el acceso público (r2.dev o un subdominio tuyo).
   - Pon esa URL en `PUBLIC_BASE` y descomenta el bloque `[[r2_buckets]]`.
5. **Límite diario por visitante (recomendado):**
   - `npx wrangler kv namespace create LIMITS`
   - Pon el id en `[[kv_namespaces]]` y descoméntalo. Por defecto son 6 vistas previas al día.
6. Publica con `npx wrangler deploy`. Te da una URL tipo `https://arsnoir-plantillas.<tu-cuenta>.workers.dev`.

## 3. Shopify

1. Tienda online → Personalizar → plantilla de producto **ilustracion** → bloque **«Personalízalo: editor de plantilla»**. Pega la URL del Worker en «URL del intermediario». Haz lo mismo en **ilustracion-familia**.
2. Prueba con tu propia foto en la vista previa del tema.
3. Cuando funcione:
   - Pasa los productos «Retrato con nombre» y «Acuarela en casa» a **Activo**.
   - Publícalos en la Tienda online.
   - En Personalízalo → sección Ilustraciones, enlaza cada estilo a su ficha.
   - Activa «Ilustraciones listas» en la sección Personalízalo para quitar el «Muy pronto».

## 4. Cada pedido de plantilla

1. Abre el pedido en Shopify. En la línea del producto verás `_Ilustración` (enlace), `Plantilla` y `Nombre`.
2. Descarga la imagen y amplíala para el tamaño pedido. Mira la tabla de píxeles en Personalízalo: para XL 60×90 hacen falta unos 7.087 × 10.630 px.
3. En Gelato: crea un pedido manual, sube la imagen, elige el mismo producto, tamaño y acabado, y pon la dirección del cliente.

## Añadir una plantilla nueva

1. Sube la imagen de referencia a Shopify → Contenido → Archivos.
2. Añádela en `workers/plantillas/templates.js` con un id nuevo, su texto (prompt) y si lleva nombre. Vuelve a publicar con `npx wrangler deploy`.
3. Duplica el producto «Retrato con nombre» y, en su ficha, pon el id nuevo en el bloque del editor.
