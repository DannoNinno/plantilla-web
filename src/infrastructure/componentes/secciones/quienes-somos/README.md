# Quiénes somos

Historia del negocio con párrafos e imagen opcional. Presencia Digital; cuenta como una sección.

| Prop        | Tipo                      | Requerida | Por defecto     |
| ----------- | ------------------------- | --------- | --------------- |
| id          | string                    | No        | Sin ancla       |
| titulo      | string                    | No        | Sin título      |
| descripcion | string                    | No        | Sin descripción |
| parrafos    | readonly string[]         | No        | []              |
| imagen      | {src, alt, width, height} | No        | Sin imagen      |

Sin imagen se usa una sola columna. Los párrafos largos se ajustan; una lista vacía no genera texto de relleno. Next Image recibe dimensiones, alt y tamaños adaptables.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, y las piezas `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`. Dependencias: React, Next.js y Tailwind 3. Tokens: `seccion`, `fontFamily.sans`, `spacing.demo-ancla`. Componente de servidor, agnóstico al negocio.
