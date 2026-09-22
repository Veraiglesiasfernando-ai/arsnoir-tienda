# ARSNOIR — tema Shopify

Tema propio (Online Store 2.0) para vender arte de pared en blanco y negro. Estética de galería: mucho blanco, tipografía limpia, obras sobre paspartú gris claro y sin trucos de dropshipping (sin contadores de tiempo, sin «X personas viendo», sin pop-ups).

## Instalar el tema

1. Shopify Admin → **Tienda online → Temas → Añadir tema → Conectar desde GitHub**.
2. Elige el repositorio `arsnoir-tienda` y la rama.
3. En el tema conectado pulsa **Personalizar** para editar textos e imágenes y, cuando esté listo, **Publicar**.

Cada cambio que se sube a la rama se sincroniza solo con el tema.

## Secciones de la tienda (colecciones)

Las colecciones ya están creadas en Shopify y son **automáticas por etiqueta**: basta con etiquetar cada obra.

| Sección      | Etiqueta del producto |
|--------------|-----------------------|
| Abstracto    | `abstracto`           |
| Líneas       | `lineas`              |
| Fotografía   | `fotografia`          |
| Tipografía   | `tipografia`          |
| Arquitectura | `arquitectura`        |
| Novedades    | `novedad`             |

Una obra puede estar en varias secciones a la vez (por ejemplo, `abstracto, novedad`).

## Cómo subir una obra para que se vea bien

- **Imagen 1 (y 2):** la obra sola, recortada al borde del papel, sobre fondo blanco o transparente. El tema la muestra centrada sobre paspartú gris con una sombra suave.
- **Imagen 3 en adelante:** fotos de la obra colgada en una pared (ambientes). Se muestran a sangre. El número de imagen desde el que empiezan se cambia en *Personalizar → Obra*.
- **Variantes:** opción 1 `Tamaño` (30 × 40, 50 × 70, 70 × 100…) y opción 2 `Marco` (Sin marco, Negro, Roble…). Se muestran como botones.
- **Proveedor** = nombre del artista (aparece encima del título).

## Menús recomendados

Contenido → Menús:

- **Menú principal** (`main-menu`): Tienda (`/collections/all`), Secciones (`/collections`), Sobre nosotros.
- **Pie** (`footer`): Envíos, Devoluciones, Contacto, Aviso legal.

## Páginas que conviene crear

- `sobre-nosotros`: quién está detrás, cómo se hace cada obra. Es lo que más distingue una tienda de arte de un dropshipping.
- `contacto`: asígnale la plantilla `page.contact`.

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
