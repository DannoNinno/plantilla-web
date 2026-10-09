# Preguntas frecuentes

Preguntas desplegables mediante `details` y `summary` nativos. Presencia Digital; cuenta como una sección.

| Prop        | Tipo                | Requerida | Por defecto     |
| ----------- | ------------------- | --------- | --------------- |
| id          | string              | No        | Sin ancla       |
| titulo      | string              | No        | Sin título      |
| descripcion | string              | No        | Sin descripción |
| elementos   | readonly Pregunta[] | No        | []              |

Cada entrada tiene `id`, `pregunta` y `respuesta`. Los controles funcionan con teclado y sin JavaScript. Se permite abrir varias respuestas; no hay animación de altura ni dependencias de acordeón. La lista vacía es válida y los textos largos se ajustan.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, y `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`. Dependencias: React, lucide-react, Tailwind 3. Tokens: `seccion`, `fontFamily.sans`, `spacing.demo-ancla`, `outlineWidth.foco`. Componente de servidor.
