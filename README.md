# arsnoir — tema Shopify

Tema propio (Online Store 2.0) para vender arte de pared en blanco y negro. Estética de galería: mucho blanco, tipografía limpia, obras sobre paspartú gris claro y sin trucos de dropshipping (sin contadores de tiempo, sin «X personas viendo», sin pop-ups).

## Instalar el tema

1. Shopify Admin → **Tienda online → Temas → Añadir tema → Conectar desde GitHub**.
2. Elige el repositorio `arsnoir-tienda` y la rama.
3. En el tema conectado pulsa **Personalizar** para editar textos e imágenes y, cuando esté listo, **Publicar**.

Cada cambio que se sube a la rama se sincroniza solo con el tema.

## Contenido de la tienda

Todo son huecos vacíos listos para tu propio arte: rectángulos gris claro con marco negro, sin imágenes de terceros, sin nombres de artistas y sin logos de prensa.

- **Cabecera:** logo «arsnoir» en texto y menú Inicio · Productos · La Historia · Contacto, con iconos de búsqueda, cuenta y carrito.
- **Portada:** fondo negro a pantalla completa con «WELCOME OFFER — 40% OFF YOUR FIRST PURCHASE» y un botón blanco «SHOP NOW».
- **Más vendidos:** 4 obras. Mientras no haya productos se muestran «Obra 01…04» a 39,95 €. Botón «VER MÁS».
- **Explorar ediciones:** Noir, Cine, Silencio y Ruido.
- **Comprar por categoría:** Tienda XL, Bellas Artes, Impresiones en Tela y Marcos de Madera.
- **La Historia:** página `/pages/la-historia` con plantilla propia (`page.historia`). El texto se edita en Shopify → Tienda online → Páginas.

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
