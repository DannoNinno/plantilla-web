# Testimonios

Citas con autor y contexto opcionales, en tarjetas separadas. Presencia Digital; cuenta como una sección.

| Prop        | Tipo                  | Requerida | Por defecto     |
| ----------- | --------------------- | --------- | --------------- |
| id          | string                | No        | Sin ancla       |
| titulo      | string                | No        | Sin título      |
| descripcion | string                | No        | Sin descripción |
| elementos   | readonly Testimonio[] | No        | []              |

Cada testimonio tiene `id`, `texto`, `autor` y `detalle` opcionales. Se usa `blockquote` con atribución en `figcaption`, sin inventar puntuaciones ni autores. El JSON de la demo advierte que sus opiniones son ficticias.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, y las piezas `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`. Dependencias: React, lucide-react, Tailwind 3. Tokens: `seccion`, `fontFamily.sans`, `spacing.demo-ancla`. Sin estado, peticiones ni CSS propio.
