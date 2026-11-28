# Formulario de contacto

Formulario accesible con nombre, correo y mensaje, y redes sociales opcionales integradas. Disponible desde Presencia Digital; formulario y redes cuentan juntos como una sección. La presentación y la lógica de interacción están separadas. Campos, resultado y validación se comparten mediante piezas base con la cotización por pasos.

## Props

| Prop | Tipo | Requerida | Valor por defecto |
| --- | --- | --- | --- |
| campos | Record<'nombre' \| 'correo' \| 'mensaje', {etiqueta, error, placeholder?}> | Sí | — |
| textos | {enviar, aviso, exito, reiniciar, errorGeneral, limite, sinJavascript} | Sí | — |
| id | string | No | — |
| titulo | string | No | — |
| descripcion | string | No | — |
| nivelTitulo | 'h1' \| 'h2' | No | 'h2' |
| redes | {etiqueta: string, enlaces: readonly {id, texto, href}[]} | No | Sin redes |
| onConsulta | (consulta: ConsultaContacto) => void | No | — |

El mínimo son `campos` y `textos`: etiquetas y estados nunca se inventan dentro del componente. Los límites son 100 caracteres para el nombre, 254 para el correo y entre 10 y 2000 para el mensaje. `validarConsulta` también verifica estos límites.

Sin título, descripción ni redes, el formulario se centra en una sola columna, sin reservar espacio para una introducción vacía. Las redes se muestran junto a la introducción; una lista vacía no genera navegación. Cada enlace recibe su texto y destino por props: no hay perfiles ni teléfonos fijados. Los IDs `instagram`, `whatsapp` y `facebook` eligen iconos Lucide; otros IDs usan `Link`. WhatsApp usa `MessageCircle` porque Lucide no incluye su logotipo oficial. Los iconos son decorativos y los nombres de las redes permanecen visibles.

## Comportamiento

Sin callback, valida y muestra un resultado local. No realiza peticiones, abre correos ni almacena datos. `onConsulta` permite a un contenedor recibir una consulta válida; no es una integración de envío real. El primer campo inválido recibe foco; el resultado y el reinicio también gestionan el foco. Los identificadores usan `useId` y permiten múltiples formularios. Sin JavaScript el envío está deshabilitado y se muestra un aviso; no hay una petición GET accidental con los datos del visitante.

## Copiar a otro proyecto

Incluir también el token `outlineWidth.foco`: los controles declaran su foco visible sin depender de estilos globales del sitio de demostración.

Copiar esta carpeta **sin `ejemplo.ts` ni `definicion.ts`**, las piezas `Base/Boton`, `Base/Contenedor`, `Base/TituloSeccion`, `Base/CampoContacto`, `Base/ResultadoContacto`, `Base/Consulta` y el helper `Base/Boton/estilos.ts`. Mantener las rutas relativas. Requiere React, lucide-react y Tailwind 3 con los tokens `brand`, `seccion`, `fontFamily.sans`, el espaciado `boveda-ancla`, y la variante `fine-pointer`. No depende del negocio, de rutas públicas ni del registro.

La antigua bandeja de la demo fue retirada. Cualquier conexión real debe implementarse en el proyecto que reutilice la pieza.
