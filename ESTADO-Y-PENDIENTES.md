# Estado y pendientes de la bóveda y las demos

Trabajo detenido a pedido de Daniel el 9 de octubre de 2026.

Se conservan los cambios locales para revisión. No se hicieron commits ni se
revirtieron archivos. La vista previa de producción en el puerto 3210 fue detenida.
No continuar la implementación sin una nueva indicación de Daniel.

## Lo que ya está implementado

- Bóveda de piezas funcionales, separada de las secciones comerciales del sitio.
- Formulario de contacto y cotización por pasos disponibles por separado.
- Contenido y textos de Café Aurora centralizados en
  [negocio.json](./src/data/demo/negocio.json).
- Presencia con cinco secciones y Captación con diez secciones iniciales.
- Novedades, catálogo sin compra, sedes, promoción y equipo reutilizables por props.
- Botonera flotante con selector de plan y control Admin / Visita en Captación.
- Edición de textos, imágenes y precios, selección de secciones y bandeja de
  contactos **simuladas en memoria**.
- Consultas de ambos formularios en la bandeja temporal, con marcar como leído,
  eliminar y restablecer.
- Vista previa de Google como maqueta del panel, no como integración real.

**No hay un backend funcional.** No se implementaron API, base de datos, login,
envío de mensajes ni persistencia. Los formularios tienen validación e
interactividad de frontend; `onConsulta` permite conectarlos posteriormente a
otro sistema. Recargar descarta la edición y la bandeja de esta demo.

## Pendientes para retomar

### 1. Revisión y cierre de los cambios actuales

- TODO(Daniel): revisar visualmente Captación y su administración antes de aprobar
  esta entrega.
- TODO(Daniel): revisar el diff y realizar los commits cuando esté conforme.
  El agente no debe hacerlos.
- TODO(Daniel): confirmar la restricción de la selección de esta demo: Portada y
  Contacto permanecen incluidos para conservar un h1 y los destinos de contacto.
  No es una restricción de las piezas reutilizables.

### 2. Validación manual pendiente

- TODO(Daniel): comprobar con el navegador visible la activación por Enter y
  Espacio, el recorrido con Tab y el foco visible en formularios y administración.
- TODO(Daniel): revisar visualmente todas las ilustraciones diferidas. El navegador
  compartido estaba oculto y no permitió confirmar su decodificación visual completa.
- TODO(Daniel): probar en dispositivos reales, especialmente de gama baja, la
  carga inicial y la interacción del editor a 360 px.
- TODO(Daniel): probar copiar una pieza a otro proyecto usando las dependencias y
  tokens documentados, sin llevar los ejemplos ni la infraestructura de la demo.

### 3. Próximas piezas de la bóveda

- TODO(Daniel): aportar y priorizar los fragmentos que quiera guardar, por ejemplo
  login, carruseles, navbars, sidebars o módulos de noticias.
- TODO(Daniel): acordar el alcance de cada pieza antes de incorporarla: presentación,
  interactividad de frontend o integración real con un servicio.
- Mantener contenido por props, tipos estrictos, fragmentación y estilos Tailwind.
  No incorporar datos de Café Aurora dentro de las piezas copiables.

### 4. Backend real: solo si se aprueba como trabajo separado

Esto **no quedó parcialmente implementado**: se excluyó del alcance de la demo
acordada. Si se decide convertir la simulación en un sistema funcional, faltaría:

- TODO(Daniel): definir stack, despliegue, datos que se guardarán y contratos de API.
- TODO(Daniel): implementar persistencia y endpoints para contenidos y consultas,
  con validación del lado del servidor.
- TODO(Daniel): definir e implementar autenticación y permisos del panel real.
- TODO(Daniel): conectar los callbacks de los formularios a los servicios reales,
  con estados de carga, éxito confirmado y errores explícitos.
- TODO(Daniel): acordar envío de correo o WhatsApp, manejo de imágenes y protección
  frente a abuso; no sustituirlos por mensajes de éxito simulados.
- Mantener ese backend fuera de los componentes visuales reutilizables y conservar
  la demo ficticia sin enviar datos reales.

### 5. Tipografía

- TODO(Daniel): aportar los archivos locales de Poppins si se quiere usar la fuente
  real. Actualmente se comparte `Poppins, system-ui, sans-serif` y se usa el
  fallback cuando no está disponible; no se descargan fuentes externas.

## Validación realizada antes de detener

- 57 pruebas aprobadas.
- Lint sin advertencias y build de producción correcto.
- `git diff --check` sin errores.
- Un h1 y sin desbordamiento horizontal a 360, 768 y 1440 px.
- Edición en vivo, límite de diez, intercambio de secciones y bandeja comprobados.
- Valores conservados al retroceder en la cotización por pasos.
- Restablecer limpia formularios, borradores, errores, mensajes y selección.
- Recargar devuelve el contenido original y la bandeja vacía.
- Sin XHR, fetch ni POST durante los dos envíos simulados.

Las limitaciones de comprobación manual están listadas arriba; no deben darse por
resueltas únicamente por haber pasado el build.

## Referencias para continuar

- [README: detalle y árbol de las fases](./README.md).
- [Registro único](./src/infrastructure/componentes/boveda/registro.ts).
- [Composición por plan](./src/demo/planes.ts).
- [Administración simulada](./src/infrastructure/componentes/demo/AdministracionDemo/).
- [Formulario por pasos](./src/infrastructure/componentes/boveda/cotizacion-pasos/).

Para volver a levantar la vista previa de producción, después de revisar los
cambios: `npm.cmd exec -- next start -p 3210`. Si se modifica código, detener esa
vista previa antes de ejecutar `npm.cmd run build` y volver a iniciarla después.
