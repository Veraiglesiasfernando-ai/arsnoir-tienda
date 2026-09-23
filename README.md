# ARSNOIR — tema Shopify

Tema propio (Online Store 2.0) para vender arte de pared original.

## Instalar el tema

1. Shopify Admin → **Tienda online → Temas → Añadir tema → Conectar desde GitHub**.
2. Elige el repositorio `arsnoir-tienda` y la rama.
3. En el tema conectado pulsa **Personalizar** para editar textos e imágenes y, cuando esté listo, **Publicar**.

Cada cambio que se sube a la rama se sincroniza solo con el tema.

## Home

Estética: fondo blanco/gris claro con degradado suave, tipografía Space Grotesk (servida desde `assets/`), negro y un único acento rojo `#E4231A`. Todos los huecos de obra son placeholders vacíos listos para tu arte.

1. **Cabecera de cristal** (sticky, translúcida): OBRAS · MANIFIESTO | ARSNOIR | búsqueda y carrito.
2. **Bienvenida:** «★ BIENVENIDO A ★», «ARSNOIR» gigante, subtítulo y 3 cartas cuadradas de cristal con esquineras. La del centro es la destacada, con el botón «Explorar obra +»; las laterales dicen «PRÓXIMAMENTE». Cada carta admite su propia imagen desde *Personalizar*.
3. **Marquesina roja** en bucle.
4. **Tira de confianza:** Arte 100% original · Impreso con Gelato · Envío a toda España · Solo en ARSNOIR.
5. **Obras destacadas:** fila deslizable con índice `[001]` en rojo, precio y botón «VER TODAS». Usa la colección «Más vendidos».
6. **Newsletter negra:** «Únete a ARSNOIR», 15% en la primera compra, botón rojo «UNIRME».
7. **Footer negro:** el texto de la página «La Historia» y 4 columnas (menús `footer-tienda`, `footer-ayuda`, `footer-arsnoir`, `footer-legal`).

## Colecciones (automáticas por etiqueta)

Etiqueta cada obra y aparece sola en su colección:

| Colección           | Etiqueta        |
|---------------------|-----------------|
| Noir                | `noir`          |
| Cine                | `cine`          |
| Silencio            | `silencio`      |
| Ruido               | `ruido`         |
| Tienda XL           | `xl`            |
| Bellas Artes        | `bellas-artes`  |
| Impresiones en Tela | `tela`          |
| Marcos de Madera    | `marco-madera`  |

«Más vendidos» incluye todas las obras ordenadas por ventas; no necesita etiqueta.

## Cómo subir una obra

- **Imagen 1:** la obra sola. En los listados se muestra dentro de un marco negro (se desactiva en *Configuración del tema → Diseño*).
- **Imágenes siguientes:** fotos de ambiente, a sangre en la ficha de producto.
- **Variantes:** por ejemplo `Tamaño` y `Marco`; se muestran como botones.

## Estructura

```
layout/     theme.liquid, password.liquid
sections/   portada, secciones, colección destacada, texto, imagen con texto,
            compromisos, newsletter, cabecera, pie y páginas principales
snippets/   tarjeta de producto, precio, iconos, meta tags
templates/  plantillas JSON (inicio, producto, colección, carrito…)
assets/     base.css, theme.js (sin dependencias)
config/     ajustes del tema (colores, tipografía, diseño)
```

Revisado con Shopify Theme Check: 0 errores.
