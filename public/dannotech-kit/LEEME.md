# Kit de marca Dannotech

Todos los archivos tienen fondo transparente. Lo unico con color propio es la D celeste, los nodos coral y el texto.

## Carpetas

- `svg/` — vectores (texto convertido a trazos, no necesitan la fuente instalada).
- `png/` — los mismos en PNG transparente. `@2x` es el doble de resolucion.
- `web/` — favicon, iconos, imagen para compartir, manifest y variables de color.
- `hoja-de-contacto.png` — vista de todo el kit.

## Nombres

`dannotech-{pieza}-{variante}`

Piezas: `isotipo` (solo simbolo), `logotipo` (solo texto), `imagotipo-horizontal`, `imagotipo-vertical`, y las dos ultimas con `-bajada` ("Sitios y tiendas para pymes").

Variantes:
- `fondo-oscuro`: T blanca, para poner sobre azul tinta u otro fondo oscuro.
- `fondo-claro`: T azul tinta, para blanco o fondos claros.
- `blanco` y `negro`: a un solo color (timbres, bordado, sobre fotos).

## Colores

| Uso | Hex |
|---|---|
| Azul tinta | #04182F |
| Celeste (la D) | #22C3F5 |
| Celeste para texto sobre claro | #0B84B8 |
| Coral | #FF6B4A |
| Coral sobre claro | #F04E2B |

Tipografia: Poppins Bold (nombre) y Poppins Medium (bajada).

## En el sitio

Copia el contenido de `web/` a la raiz publica y agrega en el `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#04182F">
<meta property="og:image" content="https://TU-DOMINIO/og-image.png">
```

## Cambiar el color de la D segun la pagina

Pega el contenido de `svg/dannotech-isotipo-css.svg` directo en el HTML (en linea, no con `<img>`) y cambia las variables:

```css
.seccion-tienda { --dt-d: #FF6B4A; }   /* la D en coral */
.pie { color: #FFFFFF; }                /* la T toma el color del texto */
```

`--dt-d` es la D, `--dt-n` los nodos y `--dt-t` la T (por defecto usa el color del texto).

## Reglas rapidas

- Deja alrededor del logo un espacio libre igual al ancho de la barra de la T.
- Bajo 32 px usa el favicon (T rellena, sin nodos).
- No estires, no agregues sombras ni brillos.
