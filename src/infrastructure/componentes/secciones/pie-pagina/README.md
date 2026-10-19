# Pie de página

Cierre del negocio con descripción y retorno al inicio opcionales. Siempre incluido; no cuenta para el límite de secciones.

| Prop        | Tipo   | Requerida | Por defecto     |
| ----------- | ------ | --------- | --------------- |
| nombre      | string | Sí        | —               |
| copyright   | string | Sí        | —               |
| descripcion | string | No        | Sin descripción |
| textoVolver | string | No        | Sin enlace      |
| hrefVolver  | string | No        | Sin enlace      |

El enlace solo aparece cuando tiene texto y destino. El pie no importa la sección de redes ni otra sección: se ensamblan como piezas independientes. Nombre y copyright llegan por props; no se consulta la fecha ni el negocio.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts` y `base/Contenedor`. Dependencias: React, Tailwind 3. Tokens: `seccion`, `brand.light`, `outlineWidth.foco`. Componente de servidor, sin estilos propios.
