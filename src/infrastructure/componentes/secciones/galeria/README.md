# Galería

Grilla de imágenes, no un carrusel ni una pieza publicada en la bóveda. Presencia Digital; cuenta como una sección.

| Prop        | Tipo                     | Requerida | Por defecto     |
| ----------- | ------------------------ | --------- | --------------- |
| id          | string                   | No        | Sin ancla       |
| titulo      | string                   | No        | Sin título      |
| descripcion | string                   | No        | Sin descripción |
| imagenes    | readonly ImagenGaleria[] | No        | []              |

Cada imagen tiene `id`, `src`, `alt`, `width`, `height` y `leyenda` opcional. La grilla usa una, dos o tres columnas. Las imágenes se cargan de forma diferida con Next Image; no hay autoplay, modal ni JavaScript cliente. La lista vacía es válida.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, y `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`. Dependencias: React, Next.js, Tailwind 3. Tokens: `seccion`, `fontFamily.sans`, `spacing.demo-ancla`. Todas las imágenes llegan por props.
