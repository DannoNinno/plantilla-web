# Portada

Sección de presentación adaptable de un negocio, con texto, acción e imagen opcionales. Disponible desde Presencia Digital; cuenta como una sección en la demo del sitio. No se publica como pieza funcional en la bóveda.

## Props

| Prop | Tipo | Requerida | Valor por defecto |
| --- | --- | --- | --- |
| titulo | string | Sí | — |
| id | string | No | — |
| etiqueta | string | No | — |
| descripcion | string | No | — |
| nivelTitulo | 'h1' \| 'h2' | No | 'h1' |
| accion | {texto: string; href: string} | No | — |
| imagen | {src: string; alt: string; width: number; height: number} | No | — |
| logo | {src: string; alt: string; width: number; height: number} | No | — |

El nivel h2 permite mostrar la pieza en una ficha que ya tiene un h1. Sin imagen ni acción, se conserva el texto y no se renderizan controles vacíos.

## Copiar a otro proyecto

Incluir también el token `outlineWidth.foco`: los controles declaran su foco visible sin depender de estilos globales del sitio de demostración.

Copiar esta carpeta **sin `ejemplo.ts` ni `definicion.ts`**, las piezas `base/Boton`, `base/Contenedor`, `base/TituloSeccion` y el helper `Boton/estilos.ts`. Mantener sus rutas relativas; no es necesario editar el componente. Requiere React, Next.js (`next/image`) y Tailwind 3 con los tokens `brand`, `seccion`, `fontFamily.sans`, `minHeight.demo-portada` y la variante `fine-pointer` del proyecto. Los activos se entregan por props; copiar o reemplazar las imágenes desde el proyecto destino. El componente no importa el ejemplo ni datos del negocio.

Los textos deben llegar por props y la imagen requiere dimensiones y texto alternativo. Los títulos largos se ajustan al ancho disponible. No se emplean estilos en línea ni hojas propias.
