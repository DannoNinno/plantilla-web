# Formulario de contacto

Formulario accesible con nombre, correo y mensaje. Disponible desde Presencia Digital; cuenta como una sección. La presentación y la lógica de interacción están separadas. Campos, resultado y validación se comparten mediante piezas base con la cotización por pasos.

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

Sin título ni descripción, el formulario se centra en una sola columna, sin reservar espacio para una introducción vacía. La bóveda usa esa presentación mínima; las demos del sitio conservan su introducción de Café Aurora.

## Comportamiento

Sin callback, valida y muestra un resultado local. No realiza peticiones, abre correos ni almacena datos. `onConsulta` permite a un contenedor recibir una consulta válida; Captación lo conecta a su bandeja en memoria. No es una integración de envío real. El primer campo inválido recibe foco; el resultado y el reinicio también gestionan el foco. Los identificadores usan `useId` y permiten múltiples formularios. Sin JavaScript el envío está deshabilitado y se muestra un aviso; no hay una petición GET accidental con los datos del visitante.

## Copiar a otro proyecto

Incluir también el token `outlineWidth.foco`: los controles declaran su foco visible sin depender de estilos globales del sitio de demostración.

Copiar esta carpeta **sin `ejemplo.ts` ni `definicion.ts`**, las piezas `base/Boton`, `base/Contenedor`, `base/TituloSeccion`, `base/CampoContacto`, `base/ResultadoContacto`, `base/consulta` y el helper `Boton/estilos.ts`. Mantener las rutas relativas. Requiere React y Tailwind 3 con los tokens `brand`, `seccion`, `fontFamily.sans`, el espaciado `demo-ancla`, y la variante `fine-pointer`. No depende del negocio, de las rutas de la demo ni del registro.

La conexión a la Bandeja de contactos de Captación está implementada en el contenedor de la demo. Los datos permanecen solo en memoria y se pierden al recargar.
