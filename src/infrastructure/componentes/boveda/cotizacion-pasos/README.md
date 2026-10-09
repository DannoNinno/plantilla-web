# Cotización por pasos

Pieza funcional disponible desde Captación. Cuenta como una sección y se publica por separado en la bóveda. No calcula precios, envía datos ni implementa un backend.

## Props

El mínimo son `campos` y `textos`, definidos en `tipos.ts`:

- `campos`: etiquetas, ayudas y errores para servicio, mensaje, nombre y correo; servicio incluye `opciones: {id, texto}[]`.
- `textos`: avisos, botones, nombres de los tres pasos, éxito, reinicio y errores. `paso` permite `{actual}` y `{total}`.
- `id`, `titulo`, `descripcion`: introducción opcional.
- `onConsulta`: callback síncrono opcional con la consulta validada. La descripción del servicio se agrega al mensaje.

Primero se elige un servicio, luego se escribe el mensaje y finalmente se completa nombre/correo. Se valida cada paso y la solicitud completa al terminar. Volver conserva los valores. Usa los mismos límites que Contacto: nombre 100, correo 254 y mensaje entre 10 y 2000 caracteres. No se pueden seleccionar servicios ajenos a las opciones recibidas. Con opciones vacías no se rompe ni avanza con una elección inválida.

Los cambios de paso enfocan su encabezado; los errores enfocan el primer campo inválido y el éxito enfoca el resultado. Sin JavaScript el avance está deshabilitado y muestra el aviso recibido por props.

## Copiar

Copiar la carpeta sin `ejemplo.ts` ni `definicion.ts`, `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`, `base/Boton`, `base/CampoContacto`, `base/ResultadoContacto`, `base/consulta` y `Boton/estilos.ts`. Mantener rutas relativas. React y Tailwind 3 son necesarios; no hay dependencias nuevas. Usa tokens `brand`, `seccion`, `fontFamily.sans`, `outlineWidth.foco`, `spacing.demo-ancla` y la variante `fine-pointer`.

La bandeja y la edición pertenecen al contenedor de demostración, no a esta pieza. TODO(Daniel): conectar `onConsulta` a un servicio real solo cuando se defina esa integración.
