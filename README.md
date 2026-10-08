# dannotech

Frontend en desarrollo con Next.js, React, TypeScript y Tailwind. Conserva la portada, perfil, catálogo, configurador local y estética de marca. Todo el contenido estructurado se obtiene de JSON locales; no hay API, autenticación, base de datos, administración ni procesamiento de Excel.

## Desarrollo

Requiere Node.js 22 o superior para Wrangler; se recomienda Node.js 24 LTS.

```sh
npm ci
npm run dev
npm run lint
npm run test:frontend
npm run build
```

`npm run build` compila Next.js en `.next`. Ya no se usa `output: 'export'` ni se genera `out`: el despliegue está preparado para Cloudflare Workers con OpenNext.

En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd` y `npx.cmd` sin cambiar la política de ejecución. OpenNext no garantiza soporte completo de Windows; ante problemas exclusivos de esa plataforma, usa WSL o Linux. No ejecutes builds sobre una carpeta `.next` utilizada por otro proceso.

## Cloudflare Workers

La configuración está en [wrangler.jsonc](./wrangler.jsonc) y [open-next.config.ts](./open-next.config.ts). El Worker se llama `dannotech` y sirve los archivos de `.open-next/assets`. No hay bindings de D1, KV ni R2.

```sh
npx opennextjs-cloudflare build
npm run preview
npm run cf-typegen
```

El build del adaptador genera `.open-next/worker.js` y `.open-next/assets`. `preview` vuelve a compilar y ejecuta el sitio en el runtime local de Workers; no despliega. Los tipos generados, `.open-next`, `.wrangler` y `.dev.vars` están excluidos de Git.

Las páginas prerenderizadas utilizan la caché de solo lectura de Workers Static Assets, recomendada por la [guía de OpenNext para sitios SSG](https://opennext.js.org/cloudflare/caching#ssg-site). Esto permite servir los paquetes generados con `generateStaticParams` y `dynamicParams = false` sin recursos externos. No soporta revalidación: los cambios de JSON se publican con un nuevo build y despliegue. Al incorporar datos dinámicos en el futuro, habrá que revisar esta estrategia.

El archivo local `.dev.vars` contiene `NEXTJS_ENV=development`; si clonas el proyecto, créalo para que la integración local utilice el entorno de desarrollo. [public/_headers](./public/_headers) configura caché inmutable solo para `/_next/static/*`.

Para Workers Builds conectado a GitHub:

- Usa Node.js 24 LTS para compilar.
- El archivo versionado [.env.production](./.env.production) define `NEXT_PUBLIC_SITE_URL=https://dannotech.cl`; Next.js lo carga en los builds de producción para resolver los metadatos. No contiene secretos; los archivos `.env.local`, `.env*.local` y `.dev.vars` siguen excluidos de Git. Evita variables del entorno de build con otro valor, ya que tienen prioridad sobre este archivo.
- Comando de build: `npx opennextjs-cloudflare build`.
- Comando de despliegue, ejecutado por Cloudflare: `npx opennextjs-cloudflare deploy`.
- Usa el comando de despliegue del adaptador, no `wrangler deploy` directamente: OpenNext prepara también los assets de caché antes de publicar.
- [wrangler.jsonc](./wrangler.jsonc) declara `dannotech.cl` y `www.dannotech.cl` como dominios personalizados del Worker; Cloudflare los aplica en el siguiente despliegue. Mantiene `workers_dev: true` y desactiva las URL de preview con `preview_urls: false`.

`npm run deploy` está disponible para construir y desplegar en un solo comando, pero no es necesario ejecutarlo localmente cuando Cloudflare publica desde GitHub. Las imágenes siguen con `unoptimized: true`; no se requiere un binding de Cloudflare Images.

## Organización

```text
src/
  app/                       Rutas, vistas y estilos globales
  data/                      Datos públicos en JSON
  domain/
    casos-de-uso/             Selección local de componentes
    servicios/               Mensajes y enlaces de contacto
    types/                   Tipos de contenido y props del frontend
  infrastructure/
    componentes/<nombre>/    Componentes visuales
    configuracion/           Configuración de Next.js
    handlers/datos.ts        Funciones simples que leen los JSON
```

Los [handlers de datos](./src/infrastructure/handlers/datos.ts) son funciones, no clases ni repositorios. Los JSON se importan directamente; no se consulta ninguna API para cargarlos. Los tipos del frontend permiten verificar su estructura durante la compilación.

## Datos

| Archivo | Contenido |
| --- | --- |
| [sitio.json](./src/data/sitio.json) | Marca, descripción, logo y flags del catálogo y demos |
| [perfil.json](./src/data/perfil.json) | Identidad, experiencia, capacidades, formación, idiomas y proyectos |
| [paquetes.json](./src/data/paquetes.json) | Paquetes y sus descripciones |
| [catalogo.json](./src/data/catalogo.json) | Filosofía de servicio, alcance, principios y costos adicionales |
| [componentes.json](./src/data/componentes.json) | Definiciones del configurador; actualmente vacío |
| [navegacion.json](./src/data/navegacion.json) | Enlaces de cabecera y pie |

Edita estos archivos para cambiar el contenido y vuelve a construir al publicar. Todo lo que incluyas es público: no agregues credenciales ni datos privados.

La voz de dannotech es la de Daniel Salamanca, su marca personal: los textos de presentación y oferta se escriben en primera persona singular y se dirigen al cliente de tú. Evita presentar la marca como una agencia o un equipo; conserva los precios, límites y condiciones al ajustar el tono.

Las descripciones de paquetes son contenido del catálogo, no funcionalidades implementadas. El registro de componentes permanece vacío, sin inventar demostraciones. Las futuras definiciones pueden mostrar su nombre y descripción en la vista previa; no cargan datos del servidor ni módulos administrativos.

El catálogo organiza los cuatro planes de [tarifas.md](./tarifas.md), con precios desde en CLP, un resumen por opción y vistas de detalle para su alcance, reuniones, capacitación, exclusiones y consideraciones según corresponda. Los servicios y costos adicionales aparecen al final del catálogo general. Los contenidos públicos se mantienen en los JSON; al actualizar las tarifas, sincroniza esos datos con el documento. Las pruebas verifican que los precios y el detalle de cada plan coincidan con la fuente. Actualmente el catálogo está desactivado: el menú y la tarjeta indican «Próximamente», y las rutas del catálogo redirigen a la portada. Para reactivarlo, cambia `catalogoHabilitado` a `true` en [sitio.json](./src/data/sitio.json) y vuelve a construir y desplegar.

Las rutas `landing` y `portal` se conservan para Presencia Digital y Captación de Clientes, respectivamente. Ambos planes tienen un plazo de hasta 5 días hábiles, con las reuniones incluidas dentro de ese período. El configurador se muestra solo si el plan tiene componentes definidos; de lo contrario, se presenta el detalle y el formulario, sin una demostración vacía ni canales de contacto adicionales dentro del plan.

Los correos oficiales se centralizan en [contacto.ts](./src/domain/configuracion/contacto.ts): `CONTACT_EMAIL` para contacto general y `QUOTES_EMAIL` para cotizaciones. No se guardan direcciones en los JSON ni se repiten en componentes. El footer y los metadatos usan esta configuración; los enlaces se construyen como `mailto:` con asuntos codificados.

La foto del perfil se carga desde `public/perfil/daniel-salamanca.png`; si no está disponible, se muestran las iniciales. La sección Demos permanece oculta mediante `demosHabilitadas` en [sitio.json](./src/data/sitio.json), lista para ejemplos propios. El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

La portada presenta tres bloques de servicios y un cuarto de entradas, cada uno con un mínimo de 70vh y scroll libre. Las ilustraciones SVG alternan derecha/izquierda/derecha en escritorio y aparecen arriba del texto en móvil. La tarjeta del catálogo desactivado usa tonos grises, un indicador de bloqueo y la etiqueta «Próximamente», sin interacción. En el perfil, la ficha profesional permanece debajo de la foto dentro de la presentación azul; la tabla de capacidades y la trayectoria quedan más abajo, bajo «Detalle técnico». Los textos mantienen un tono cercano y directo.

Cada bloque de la portada tiene un fondo diferenciado (celeste, azul oscuro, coral suave y gris azulado) y un encabezado discreto del 01 al 04. Los tres bloques de servicio tienen un único enlace Siguiente; el cuarto presenta las elecciones Catálogo/Perfil. No hay stepper ni botones Anterior. «Explorar el sitio» comienza en el primer bloque. El recorrido es opcional y siempre permite scroll libre. Los enlaces conservan sus anclas sin JavaScript y respetan la cabecera fija. Con JavaScript, la animación del destino se reproduce completa al terminar el desplazamiento, incluso si ya se había visto el bloque. Una rueda, gesto táctil, interacción de teclado o nuevo clic puede interrumpir el recorrido sin bloquear la navegación. Con movimiento reducido, el salto es inmediato y sin animación.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

Los botones comparten las variantes Tailwind de [estilos.ts](./src/infrastructure/componentes/Boton/estilos.ts): color, sombra suave y desplazamiento breve al hacer hover con un puntero preciso, con respuesta equivalente al foco por teclado. Los efectos de movimiento respetan `prefers-reduced-motion` y los botones deshabilitados no se elevan ni muestran sombra.

El navbar identifica la sección actual con texto celeste, un subrayado fino y `aria-current="page"`. Catálogo permanece marcado en los detalles de sus planes; los enlaces inactivos solo cambian de color al hacer hover, sin un fondo adicional.

[globals.css](./src/app/globals.css) contiene las directivas de Tailwind y las reglas de entrada por scroll. El componente [EntradaScroll](./src/infrastructure/componentes/EntradaScroll/EntradaScroll.tsx) usa IntersectionObserver y activa las clases solo después de cargar JavaScript: el contenido es visible sin JavaScript o con movimiento reducido. La entrada por scroll manual ocurre una sola vez al ver el 20% del bloque; si una sección supera cinco ventanas de alto, se revela al llenar la ventana para que las tablas largas no queden ocultas. El foco por teclado también revela el contenido. La transición dura 600ms, con ease-out, opacidad, desplazamiento de 24px y blur de 8px. Título, texto e ilustración se escalonan a 0/100/200ms; los pasos del proceso, cada 120ms. Perfil, catálogo y detalles de planes comparten este efecto. No hay scroll-snap ni bloqueo del scroll.

El resto de los estilos utiliza utilidades Tailwind, sin `@apply` ni hojas de estilos adicionales. La variante `fine-pointer` conserva los efectos hover solo para dispositivos con puntero preciso; las utilidades de foco y movimiento reducido mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios y selección

La página `/contacto/` contiene el formulario compartido, con nombre, correo, un selector de los cuatro planes y la opción Consulta, y un mensaje de hasta 200 palabras. Tiene una única acción principal y no muestra la dirección destinataria ni enlaces de correo adicionales dentro del formulario. El footer mantiene el enlace `mailto:` con la dirección `contacto@dannotech.cl`. El límite se valida por palabras (separadas por espacios, tabulaciones o saltos de línea), no por caracteres; al excederlo se informa el error y se bloquea la preparación del correo.

En los planes se preselecciona el plan correspondiente. Consulta prepara un `mailto:` a `CONTACT_EMAIL`; un plan prepara uno a `QUOTES_EMAIL`, con el nombre del plan en el asunto y los datos del formulario en el cuerpo. El usuario debe tener un programa de correo configurado, revisar el borrador y enviarlo desde allí. El sitio no envía ni almacena solicitudes, no muestra confirmaciones de envío y no integra SMTP ni APIs de correo. El backend y el panel administrativo para gestionar solicitudes quedan pendientes, sin diseñarlos en esta etapa.

El configurador mantiene su selección y resolución de dependencias únicamente en memoria del navegador. No persiste datos al salir ni modifica el sitio.

Rutas disponibles: `/`, `/perfil/` y `/contacto/`. Mientras el catálogo esté desactivado, `/catalogo/` y todas sus subrutas redirigen a `/`; el contenido y las rutas de los cuatro planes permanecen listos para reactivarse con el flag. Las rutas `/api` y `/admin` ya no existen.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
