# Estado del diseño y la biblioteca

## Referencia

El diseño de `restore-point` (`8f384f3`, 9 de octubre de 2026) es la base de
`fix/recuperar-diseno`. La reforma se aplica sobre esa base sin merge ni commit.
`main`, `dev` y `restore-point` no se modifican.

## Integración

- Home: se conservan las cuatro secciones, ilustraciones, puertas, animaciones
  y degradados. Solo se retira «cuatro» de la tarjeta del catálogo y se separan
  explícitamente las líneas del título.
- Catálogo: presentación, un carrusel que integra tarjetas y comparación,
  enlace a componentes, condiciones compactas y adicionales. El carrusel muestra
  un solo plan a la vez en todos los tamaños, sin scroll horizontal, con flechas,
  indicadores, navegación por teclado y acciones de cotizar o ver detalles.
  Filosofía, alcance y compromisos comparten una superficie con todo el contenido
  visible; se mantiene el ancla de alcance y las animaciones de entrada.
- Planes: Presencia Digital y Captación de Clientes habilitados; Automatización
  y Comercio Electrónico aparecen como «Próximamente», sin precio ni enlace.
  Sus detalles responden 404 y no se ofrecen en Contacto.
- Detalle: plazo junto al precio, vitrina en lugar de la demo y formulario final
  integrado con el plan preseleccionado.
- Perfil: versión de referencia con foto, introducción, enlaces y detalle técnico.
  Solo se retira el bloque de demos; no se incorpora `BeneficiosPyme`.
- Se conservan `EntradaScroll`, su CSS, los atributos de animación,
  `SaltoContenido`, el interruptor del catálogo y el correo visible en el footer.

## Biblioteca conservada

Las piezas de [boveda](./src/infrastructure/componentes/boveda/) y
[secciones](./src/infrastructure/componentes/secciones/) siguen siendo reutilizables
por props. Sus ejemplos consumen
[ejemplos-boveda.json](./src/data/ejemplos-boveda.json), y los activos viven en
[public/ejemplos-boveda](./public/ejemplos-boveda/).

Se retiran las rutas de demo, fichas individuales de componentes, configurador
y herramientas de administración simulada. Los formularios de la biblioteca
conservan sus callbacks opcionales; no incorporan envío real ni persistencia.
La página pública `/componentes/` es una vitrina descriptiva, no un entorno
interactivo para ejecutar los ejemplos.

## Pendientes de contenido

- Revisar las propuestas marcadas con `TODO(Daniel)` en los datos de la vitrina;
  esas notas no se muestran al visitante.
- Aportar los archivos locales de Poppins si se desea reemplazar el fallback
  del sistema. No se descargan fuentes externas.
- Cualquier envío real de los formularios reutilizables requiere una integración
  definida por separado; el formulario del portal prepara un correo local.

## Verificación

Ejecutar `npm run lint`, `npm run test:frontend` y `npm run build`.
Comparar home, catálogo, detalle y perfil a 360, 768 y 1440 px contra la referencia,
incluyendo entrada por scroll, foco, hover y movimiento reducido.
