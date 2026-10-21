# dannotech

Frontend en desarrollo con Next.js, React, TypeScript y Tailwind. Conserva la portada, perfil, catálogo y estética de marca. Todo el contenido estructurado se obtiene de JSON locales; no hay API, autenticación, base de datos, administración ni procesamiento de Excel.

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

`npm run lint` usa ESLint CLI sobre `src`, `tests` y `tailwind.config.ts`, con cero advertencias permitidas. [eslint.config.mjs](./eslint.config.mjs) mantiene las reglas de Next.js y Prettier mediante `FlatCompat`; ya no se usa el comando deprecado `next lint`. `npm run lint:fix` aplica las correcciones automáticas con el mismo alcance.

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
- Cloudflare detecta pnpm e instala con `pnpm install --frozen-lockfile`. [pnpm-workspace.yaml](./pnpm-workspace.yaml) declara el proyecto raíz como único paquete; conserva `packages` para que pnpm 9 pueda leer la configuración y mantén [pnpm-lock.yaml](./pnpm-lock.yaml) sincronizado con las dependencias.
- El archivo versionado [.env.production](./.env.production) define `NEXT_PUBLIC_SITE_URL=https://dannotech.cl`; Next.js lo carga en los builds de producción para resolver los metadatos. No contiene secretos; los archivos `.env.local`, `.env*.local` y `.dev.vars` siguen excluidos de Git. Evita variables del entorno de build con otro valor, ya que tienen prioridad sobre este archivo.
- Mantén Next.js en una versión soportada por su política oficial (actualmente 16.x en este proyecto). OpenNext aborta el build si detecta una versión EOL; el flag `--dangerouslyUseUnsupportedNextVersion` existe, pero no se recomienda para producción.
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
| [sitio.json](./src/data/sitio.json) | Marca, descripción y logo |
| [perfil.json](./src/data/perfil.json) | Identidad, experiencia, capacidades, formación, idiomas y proyectos |
| [paquetes.json](./src/data/paquetes.json) | Paquetes y sus descripciones |
| [catalogo.json](./src/data/catalogo.json) | Filosofía de servicio, alcance, principios y costos adicionales |
| [componentes.json](./src/data/componentes.json) | 19 componentes descriptivos, icono, plan mínimo y revisión pendiente |
| [ejemplos-boveda.json](./src/data/ejemplos-boveda.json) | Contenido ficticio para los ejemplos tipados de la biblioteca, no para el sitio público |
| [navegacion.json](./src/data/navegacion.json) | Enlaces de cabecera y pie |

Edita estos archivos para cambiar el contenido y vuelve a construir al publicar. Todo lo que incluyas es público: no agregues credenciales ni datos privados.

La voz de dannotech es la de Daniel Salamanca, su marca personal: los textos de presentación y oferta se escriben en primera persona singular y se dirigen al cliente de tú. Evita presentar la marca como una agencia o un equipo; conserva los precios, límites y condiciones al ajustar el tono.

Las descripciones de paquetes y componentes son contenido del catálogo, no funcionalidades implementadas. La vitrina de `/componentes` contiene únicamente artículos informativos, sin enlaces, controles ni funciones activas dentro de las tarjetas. Describir WhatsApp, formularios o administración no activa esas funciones en este sitio.

La [selección de vitrina](./src/domain/casos-de-uso/componentes/seleccion.ts) aplica la herencia de `landing` en `portal`, excluye los componentes cuyo plan mínimo está desactivado y ordena primero los destacados. Presencia Digital muestra sus 11 componentes y el panel atenuado al final; Captación de Clientes muestra los 19 con el panel primero. La página general agrupa los componentes por plan mínimo, sin duplicados. La grilla solo dibuja la lista seleccionada por cada página.

Los [iconos de vitrina](./src/infrastructure/componentes/Vitrina/iconos.ts) usan imports explícitos y claves estrictas; el handler rechaza iconos o planes mínimos inválidos del JSON. Cada descripción propuesta incluye un `TODO(Daniel)` en `revisionDescripcion`, visible en los datos pero no en la interfaz. La introducción también queda pendiente de revisión en `catalogo.json`; las etiquetas de disponibilidad no cambian los límites del plan.

El catálogo conserva los cuatro planes de [tarifas.md](./tarifas.md). El campo `habilitado` de [paquetes.json](./src/data/paquetes.json) controla su disponibilidad: Presencia Digital y Captación de Clientes están activos; Automatización de Procesos y Comercio Electrónico aparecen atenuados como «Próximamente», sin precio ni enlace. `getPaquetes()` conserva todos los datos para el catálogo; `getPaquetesHabilitados()` y `getPaquete()` solo exponen los activos para detalles, rutas estáticas y contacto. Los planes desactivados responden 404 y no se pueden cotizar en el formulario. Los servicios y costos adicionales aparecen al final del catálogo general. Al actualizar las tarifas, sincroniza los JSON con el documento; las pruebas conservan la verificación de precios y detalle de los cuatro planes.

Las rutas `landing` y `portal` se conservan para Presencia Digital y Captación de Clientes, respectivamente. Ambos planes tienen un plazo de hasta 5 días hábiles, visible junto al precio, con las reuniones incluidas dentro de ese período. El detalle mantiene `PresentacionPaquete`, `DetallePaquete`, `EnlacesPaquete` y `ConsultaPaquete`; esta última integra el formulario al final, con el plan preseleccionado. La vitrina descriptiva ocupa el lugar de la antigua demo. Contacto conserva el parámetro `?paquete=`.

El diseño de referencia es `restore-point` (`8f384f3`, 9 de octubre de 2026). La reforma se incorpora sobre él, sin reemplazar sus páginas. El home conserva el hero con «Explorar el sitio», las cuatro secciones numeradas, ilustraciones, degradados y puertas de Catálogo y Perfil. El perfil conserva `FotoPerfil`, los botones Hablemos, Detalle técnico y LinkedIn, y la sección técnica; no incorpora `BeneficiosPyme`. El grupo de rutas `(portal)` conserva `SaltoContenido`. El interruptor `catalogoHabilitado` sigue controlando los enlaces, la etiqueta «Próximamente» y la redirección del catálogo.

`PaginaCatalogo` conserva sus piezas y concentra el contenido en presentación, planes, condiciones y adicionales. «Elige tu punto de partida» usa [CoverflowCarousel](./src/infrastructure/componentes/Carousel/CoverflowCarousel.tsx): tarjetas verticales, con la seleccionada centrada y sus vecinas reducidas y atenuadas; en móvil solo asoman por los bordes. Cada plan activo muestra resumen, precio y los cinco criterios de `comparacion` en una columna, seguidos de «Cotizar este plan» (a `/contacto?paquete=...`) y «Ver detalles». Las flechas a los lados y las tarjetas vecinas permiten seleccionar; debajo solo se muestra «Plan N de 4», sin indicadores numerados. También hay swipe horizontal y navegación con izquierda/derecha e Inicio/Fin al enfocar el carrusel. No hay bucle, avance automático ni scroll horizontal. Las transiciones duran 400 ms y se desactivan con movimiento reducido. Solo la tarjeta central permite interactuar con su contenido; las vecinas ofrecen un control de selección y el resto queda fuera del árbol accesible y del foco. El cambio se anuncia con `aria-live`. El componente recibe contenido y etiquetas sin depender de planes; [useCarousel](./src/infrastructure/componentes/Carousel/useCarousel.ts) concentra estado, límites, teclado y swipe. Los planes desactivados conservan nombre, resumen y «Próximamente», sin precio, prestaciones ni acciones. El enlace a todos los componentes queda al final del bloque.

El fondo de «Elige tu punto de partida» abarca toda esa sección, con cortes rectos, bordes superior e inferior y un degradado celeste–blanco–coral definido con utilidades Tailwind de la paleta de marca. No modifica los fondos de las demás secciones.

`CondicionesCatalogo` reúne «No solo desarrollo páginas web», «Gestión de alcance» y «Mis compromisos contigo» en una única superficie compacta, con todos los textos visibles, sin acordeones ni tarjetas separadas. Mantiene la animación de entrada y el ancla `#alcance` de los detalles de plan.

Los detalles conservan las grillas, tarjetas y animaciones de `restore-point`. El panel de administración ocupa una fila completa en la vitrina e incluye una descripción ampliada por puntos. Sus textos siguen siendo descriptivos, no activan una administración real.

Los correos oficiales se centralizan en [contacto.ts](./src/domain/configuracion/contacto.ts): `CONTACT_EMAIL` para contacto general y `QUOTES_EMAIL` para cotizaciones. No se guardan direcciones en los JSON ni se repiten en componentes. El footer, el perfil y los metadatos usan esta configuración; los enlaces se construyen como `mailto:` con asuntos codificados.

El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

Los botones comparten las variantes Tailwind de [estilos.ts](./src/infrastructure/componentes/Boton/estilos.ts): color, sombra suave y desplazamiento breve al hacer hover con un puntero preciso, con respuesta equivalente al foco por teclado. Los efectos de movimiento respetan `prefers-reduced-motion` y los botones deshabilitados no se elevan ni muestran sombra.

El navbar identifica la sección actual con texto celeste, un subrayado fino y `aria-current="page"`. Catálogo permanece marcado en los detalles de sus planes; los enlaces inactivos solo cambian de color al hacer hover, sin un fondo adicional.

[globals.css](./src/app/globals.css) conserva las tres directivas de Tailwind y el bloque `@layer components` de animaciones de entrada. Es la única hoja de estilos: no se agregan hojas adicionales ni estilos inline. `EntradaScroll`, `data-entrada-elemento`, `data-entrada-paso` y `.entrada-ligera` mantienen la revelación progresiva y sus retrasos. La variante `fine-pointer` limita el hover a punteros precisos; el foco y `prefers-reduced-motion` mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios

La página `/contacto/` contiene el formulario compartido, con nombre, correo, un selector de los dos planes habilitados y la opción Consulta, y un mensaje de hasta 200 palabras. Tiene una única acción principal y no muestra la dirección destinataria ni enlaces de correo adicionales dentro del formulario. El footer mantiene el enlace `mailto:` con el texto «Escríbeme por correo». El límite se valida por palabras (separadas por espacios, tabulaciones o saltos de línea), no por caracteres; al excederlo se informa el error y se bloquea la preparación del correo.

Las botoneras de cada plan enlazan a `/contacto/?plan=landing` o `/contacto/?plan=portal`. La página de Contacto conserva su prerenderizado estático y lee el parámetro dentro de un límite de Suspense; valida que el plan esté habilitado y lo preselecciona. Si no está disponible, informa al usuario y permite una Consulta. Cambiar de plan mediante navegación cliente también actualiza la selección. Consulta prepara un `mailto:` a `CONTACT_EMAIL`; un plan prepara uno a `QUOTES_EMAIL`, con el nombre del plan en el asunto y los datos del formulario en el cuerpo. El usuario debe tener un programa de correo configurado, revisar el borrador y enviarlo desde allí. El sitio no envía ni almacena solicitudes, no muestra confirmaciones de envío y no integra SMTP ni APIs de correo. El backend y el panel administrativo para gestionar solicitudes quedan pendientes, sin diseñarlos en esta etapa.

Rutas disponibles: `/`, `/perfil/`, `/contacto/`, `/catalogo/`, `/catalogo/landing/`, `/catalogo/portal/` y `/componentes/`. La vitrina tiene título y descripción propios para buscadores; se accede desde los detalles de los planes. No se publican detalles de componentes ni rutas de demo. Las rutas `/api` y `/admin` ya no existen. Los planes desconocidos o desactivados no generan páginas y devuelven 404.

## Biblioteca reutilizable

Se conservan [boveda](./src/infrastructure/componentes/boveda), [secciones](./src/infrastructure/componentes/secciones) y sus [bases compartidas](./src/infrastructure/componentes/base), incorporadas en el historial remoto. Son independientes de la vitrina comercial: esta solo describe la oferta y no monta piezas interactivas.

El [registro](./src/infrastructure/componentes/boveda/registro.ts) mantiene tipos, documentación de props, ejemplos e instancias editables en memoria. Los ejemplos consumen [ejemplos-boveda.json](./src/data/ejemplos-boveda.json) mediante un proveedor propio; las ilustraciones originales están en [public/ejemplos-boveda](./public/ejemplos-boveda). No dependen de módulos ni rutas de demo. Los tokens `seccion`, `canal`, `boveda-ancla` y `boveda-portada` de Tailwind pertenecen a esas piezas y no sustituyen la paleta del sitio.

Los formularios reutilizables validan sus props y entregan consultas mediante callbacks opcionales, sin conectar servicios externos. Los ejemplos usan datos ficticios y enlaces internos, nunca números ni perfiles reales. No hay administración pública, bandeja, persistencia ni backend. `npm run test:frontend` ejecuta tanto las pruebas de la reforma UX como las de la biblioteca; se retiran únicamente las verificaciones específicas de las demos eliminadas.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
