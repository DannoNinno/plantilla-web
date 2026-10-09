# Formulario de contacto

Formulario accesible con nombre, correo y mensaje. Disponible desde Presencia Digital; cuenta como una sección. La presentación, los campos, el resultado y la lógica de interacción están separados dentro de esta carpeta.

## Props

| Prop | Tipo | Requerida | Valor por defecto |
| --- | --- | --- | --- |
| campos | Record<'nombre' \| 'correo' \| 'mensaje', {etiqueta, error, placeholder?}> | Sí | — |
| textos | {enviar, aviso, exito, reiniciar, errorGeneral, limite, sinJavascript} | Sí | — |
| id | string | No | — |
| titulo | string | No | — |
| descripcion | string | No | — |
| nivelTitulo | 'h1' \| 'h2' | No | 'h2' |
| onConsulta | (consulta: ConsultaContacto) => void | No | — |

El mínimo son `campos` y `textos`: etiquetas y estados nunca se inventan dentro del componente. Los límites son 100 caracteres para el nombre, 254 para el correo y entre 10 y 2000 para el mensaje. `validarConsulta` también verifica estos límites.

## Comportamiento

Sin callback, valida y muestra un resultado local. No realiza peticiones, abre correos ni almacena datos. `onConsulta` permite a un contenedor recibir una consulta válida; la demo de fase 1 no lo necesita. No es una integración de envío real. El primer campo inválido recibe foco; el resultado y el reinicio también gestionan el foco. Los identificadores usan `useId` y permiten múltiples formularios. Sin JavaScript el envío está deshabilitado y se muestra un aviso; no hay una petición GET accidental con los datos del visitante.

## Copiar a otro proyecto

Incluir también el token `outlineWidth.foco`: los controles declaran su foco visible sin depender de estilos globales del sitio de demostración.

Copiar esta carpeta **sin `ejemplo.ts`**, las piezas `base/Boton`, `base/Contenedor`, `base/TituloSeccion` y el helper `Boton/estilos.ts`. Mantener las rutas relativas. Requiere React y Tailwind 3 con los tokens `brand`, `seccion`, `fontFamily.editorial`, el espaciado `demo-ancla`, y la variante `fine-pointer`. No depende del negocio, de las rutas de la demo ni del registro.

TODO(Daniel): en fase 3 conectar `onConsulta` a la Bandeja de contactos del panel simulado. Los datos permanecerán solo en memoria y se perderán al recargar.
