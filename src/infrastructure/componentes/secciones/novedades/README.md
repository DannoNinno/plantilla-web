# Novedades

Sección de Captación; cuenta para el límite. No se publica como pieza funcional de la bóveda.

Props exportadas: `NovedadesProps`, con `id`, `titulo`, `descripcion` y `elementos` opcionales. Cada noticia incluye `id`, `titulo` y opcionalmente `descripcion`, `fecha` (texto recibido) e `imagen` con `src`, `alt`, `width`, `height`. Lista vacía por defecto; sin solicitudes ni estados interactivos. Las tarjetas viven en `TarjetaNovedad.tsx`.

Para copiar, excluir `ejemplo.ts` y `definicion.ts`; incluir `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion` y `base/ImagenContenido`. Requiere React, Next Image y Tailwind 3 con tokens `seccion`, `fontFamily.sans` y `spacing.demo-ancla`. Todo el contenido llega por props.
