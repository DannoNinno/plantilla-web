# Ubicación y horarios

Dirección semántica, horario e imagen opcional. Presencia Digital; cuenta como una sección. No incorpora mapas externos.

| Prop              | Tipo                      | Requerida | Por defecto        |
| ----------------- | ------------------------- | --------- | ------------------ |
| id                | string                    | No        | Sin ancla          |
| titulo            | string                    | No        | Sin título         |
| descripcion       | string                    | No        | Sin descripción    |
| nombre            | string                    | No        | Sin nombre de sede |
| direccion         | string                    | No        | Sin dirección      |
| horarios          | string                    | No        | Sin horario        |
| etiquetaDireccion | string                    | Sí        | —                  |
| etiquetaHorarios  | string                    | Sí        | —                  |
| imagen            | {src, alt, width, height} | No        | Sin imagen         |

Los datos faltantes no generan etiquetas vacías. La imagen requiere dimensiones y alt. El ejemplo toma dirección y horario de la primera sede del JSON, sin duplicarlos. Sus datos son ficticios y no enlazan a un lugar real.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, y las piezas `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`. Dependencias: React, Next.js, lucide-react, Tailwind 3. Tokens: `seccion`, `fontFamily.sans`, `spacing.demo-ancla`. Sin JavaScript cliente ni iframes.
