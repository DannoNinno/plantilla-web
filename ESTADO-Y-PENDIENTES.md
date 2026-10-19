# Estado de la reforma UX y la biblioteca

La reforma UX sustituye las demos anteriores por una vitrina descriptiva.
Este documento reemplaza el estado historico del 9 de octubre de 2026; los
pendientes de aquella demo y su restriccion temporal de commits ya no aplican.

## Alcance integrado

- Presencia Digital y Captacion de Clientes habilitados; los otros dos planes
  permanecen como Proximamente, sin precio, enlace ni posibilidad de cotizacion.
- Vitrina informativa de 19 componentes, sin controles ni vistas interactivas.
- Home, catalogo, detalles y perfil reorganizados para orientar a clientes Pyme.
- Catalogo reducido a un cuadro comparativo en carrusel con los cuatro planes
  y los servicios de costo adicional, sin bloques de presentacion comercial.
- Grillas de detalle alineadas y panel de administracion a todo el ancho,
  con informacion ampliada sobre edicion de contenido y capacitacion.
- Cada detalle tiene acciones al inicio y al final, con mensajes distintos
  para cotizar y volver a ver planes. El formulario queda solo en Contacto.
- Contacto disponible en el pie y desde las acciones de cada plan; preselecciona
  el plan habilitado del enlace e informa si no esta disponible. Prepara un
  correo local, sin enviar ni guardar solicitudes.
- Biblioteca de [boveda](./src/infrastructure/componentes/boveda),
  [secciones](./src/infrastructure/componentes/secciones) y bases conservada.
- Ejemplos tipados con datos ficticios en
  [ejemplos-boveda.json](./src/data/ejemplos-boveda.json) e ilustraciones originales
  en [public/ejemplos-boveda](./public/ejemplos-boveda).
- Registro, validaciones y edicion inmutable reutilizables, independientes de
  las rutas y herramientas de demo retiradas.
- Sin rutas de demo, fichas interactivas, selector, editor administrativo
  publico ni bandeja de mensajes. No hay API, base de datos, login o backend.

## Validacion de la integracion

La integracion paso `npm run lint` sin advertencias, las 56 pruebas de
`npm run test:frontend`, `npm run build` y la comprobacion en navegador de las
siete rutas publicas a 360, 768 y 1440 px.

Las 21 vistas conservaron un h1 y no tuvieron desbordamiento horizontal ni
errores JavaScript; se verificaron 198 enlaces con foco visible. Las rutas
retiradas de demo y fichas, y los dos planes desactivados, respondieron 404.
Las descripciones breves de la vitrina se conservan; el panel agrega tres
puntos de informacion. El formulario
permitio 200 palabras y bloqueo 201, ofreciendo solo Consulta y los planes
habilitados. No se probaron envios de correo externos ni dispositivos fisicos.

El carrusel se recorrio mediante flechas en los tres anchos, incluido el
teclado y el respeto al movimiento reducido. Se verificaron filas alineadas,
panel a todo el ancho y ambas acciones de cotizacion de cada plan, con la
seleccion correcta en Contacto. Los parametros de planes desactivados o
inexistentes muestran un aviso y permiten una Consulta.

La suite incluye la reforma UX y las pruebas de componentes, ejemplos,
validaciones e instancias de la biblioteca. Las pruebas exclusivas de las
demos retiradas ya no forman parte del alcance.

## Pendientes de contenido y trabajos separados

- TODO(Daniel): revisar los textos editoriales marcados en los JSON.
- TODO(Daniel): aportar los archivos locales de Poppins si se quiere usar
  la fuente real; actualmente se conserva el fallback de sistema.
- TODO(Daniel): probar en dispositivos fisicos y otros navegadores.
- TODO(Daniel): priorizar futuras piezas de la biblioteca antes de ampliarla.

Un backend, autenticacion, almacenamiento de consultas, envio de mensajes o
integracion real con WhatsApp requieren una aprobacion y un trabajo separados.
No deben inferirse de las descripciones de la vitrina ni de los callbacks de
las piezas reutilizables.

La organizacion y los comandos vigentes estan en [README.md](./README.md).
