# Sedes

Sección de Captación; cuenta para el límite. Direcciones y horarios son textos recibidos, sin mapas externos.

Props exportadas: `SedesProps`. `etiquetaDireccion` y `etiquetaHorarios` son obligatorias. `id`, `titulo`, `descripcion`, `sedes` son opcionales. Cada sede tiene `id`, `nombre` y opcionalmente `direccion`, `horarios`, `imagen`. Lista vacía por defecto. Las tarjetas viven en `TarjetaSede.tsx`; la dirección usa HTML semántico.

Para copiar, excluir `ejemplo.ts` y `definicion.ts`; incluir `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`, `base/ImagenContenido`. Requiere React, Next Image y Tailwind 3 con tokens `seccion`, `fontFamily.sans`, `spacing.demo-ancla`. El negocio nunca se importa desde la presentación.
