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

`npm run lint` usa ESLint CLI sobre `src` y `tests`, con cero advertencias permitidas. [eslint.config.mjs](./eslint.config.mjs) mantiene las reglas de Next.js y Prettier mediante `FlatCompat`; ya no se usa el comando deprecado `next lint`. `npm run lint:fix` aplica las correcciones automáticas con el mismo alcance.

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
| [navegacion.json](./src/data/navegacion.json) | Enlaces de cabecera y pie |

Edita estos archivos para cambiar el contenido y vuelve a construir al publicar. Todo lo que incluyas es público: no agregues credenciales ni datos privados.

La voz de dannotech es la de Daniel Salamanca, su marca personal: los textos de presentación y oferta se escriben en primera persona singular y se dirigen al cliente de tú. Evita presentar la marca como una agencia o un equipo; conserva los precios, límites y condiciones al ajustar el tono.

Las descripciones de paquetes y componentes son contenido del catálogo, no funcionalidades implementadas. La vitrina de `/componentes` contiene únicamente artículos informativos, sin enlaces, controles ni funciones activas dentro de las tarjetas. Describir WhatsApp, formularios o administración no activa esas funciones en este sitio.

La [selección de vitrina](./src/domain/casos-de-uso/componentes/seleccion.ts) aplica la herencia de `landing` en `portal`, excluye los componentes cuyo plan mínimo está desactivado y ordena primero los destacados. Presencia Digital muestra sus 11 componentes y el panel atenuado al final; Captación de Clientes muestra los 19 con el panel primero. La página general agrupa los componentes por plan mínimo, sin duplicados. La grilla solo dibuja la lista seleccionada por cada página.

Los [iconos de vitrina](./src/infrastructure/componentes/Vitrina/iconos.ts) usan imports explícitos y claves estrictas; el handler rechaza iconos o planes mínimos inválidos del JSON. Cada descripción propuesta incluye un `TODO(Daniel)` en `revisionDescripcion`, visible en los datos pero no en la interfaz. La introducción también queda pendiente de revisión en `catalogo.json`; las etiquetas de disponibilidad no cambian los límites del plan.

El catálogo conserva los cuatro planes de [tarifas.md](./tarifas.md). El campo `habilitado` de [paquetes.json](./src/data/paquetes.json) controla su disponibilidad: Presencia Digital y Captación de Clientes están activos; Automatización de Procesos y Comercio Electrónico aparecen atenuados como «Próximamente», sin precio ni enlace. `getPaquetes()` conserva todos los datos para el catálogo; `getPaquetesHabilitados()` y `getPaquete()` solo exponen los activos para detalles, rutas estáticas y contacto. Los planes desactivados responden 404 y no se pueden cotizar en el formulario. Los servicios y costos adicionales aparecen al final del catálogo general. Al actualizar las tarifas, sincroniza los JSON con el documento; las pruebas conservan la verificación de precios y detalle de los cuatro planes.

Las rutas `landing` y `portal` se conservan para Presencia Digital y Captación de Clientes, respectivamente. Ambos planes tienen un plazo de hasta 5 días hábiles, con las reuniones incluidas dentro de ese período. Cada detalle presenta el alcance del plan y el formulario de contacto, sin vista previa interactiva.

El home dirige a los planes desde el hero, explica qué hago y para quién y ofrece un enlace secundario a contacto debajo de sus dos tarjetas. El perfil agrega tres beneficios para pymes al inicio y su botón «Hablemos» lleva a `/contacto`. Los textos propuestos conservan `TODO(Daniel)` en los JSON, sin exponer esas notas al visitante. El menú principal ofrece Catálogo y Perfil; Contacto se mantiene en el footer y en los botones de contacto, no en la cabecera.

El catálogo presenta primero los planes y su comparación, luego el enlace a componentes, la filosofía, las condiciones y los adicionales. La comparación usa el resumen estructurado `comparacion` de cada plan activo en [paquetes.json](./src/data/paquetes.json): límite de secciones, panel de administración, entrega, reuniones y capacitación. El detalle reutiliza ese plazo junto al precio. Las pruebas verifican que el resumen coincida con las secciones completas y que no se comparen planes desactivados; los encabezados de reuniones y exclusiones usan mayúscula inicial también en [tarifas.md](./tarifas.md).

Los correos oficiales se centralizan en [contacto.ts](./src/domain/configuracion/contacto.ts): `CONTACT_EMAIL` para contacto general y `QUOTES_EMAIL` para cotizaciones. No se guardan direcciones en los JSON ni se repiten en componentes. El footer, el perfil y los metadatos usan esta configuración; los enlaces se construyen como `mailto:` con asuntos codificados.

El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

Los botones comparten las variantes Tailwind de [estilos.ts](./src/infrastructure/componentes/Boton/estilos.ts): color, sombra suave y desplazamiento breve al hacer hover con un puntero preciso, con respuesta equivalente al foco por teclado. Los efectos de movimiento respetan `prefers-reduced-motion` y los botones deshabilitados no se elevan ni muestran sombra.

El navbar identifica la sección actual con texto celeste, un subrayado fino y `aria-current="page"`. Catálogo permanece marcado en los detalles de sus planes; los enlaces inactivos solo cambian de color al hacer hover, sin un fondo adicional.

[globals.css](./src/app/globals.css) contiene solamente las tres directivas de Tailwind. Los componentes usan utilidades directamente, sin clases CSS propias, `@apply` ni hojas de estilos adicionales. La variante `fine-pointer` conserva los efectos hover solo para dispositivos con puntero preciso; las utilidades de foco y movimiento reducido mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios

La página `/contacto/` contiene el formulario compartido, con nombre, correo, un selector de los dos planes habilitados y la opción Consulta, y un mensaje de hasta 200 palabras. Tiene una única acción principal y no muestra la dirección destinataria ni enlaces de correo adicionales dentro del formulario. El footer mantiene el enlace `mailto:` con el texto «Escríbeme por correo». El límite se valida por palabras (separadas por espacios, tabulaciones o saltos de línea), no por caracteres; al excederlo se informa el error y se bloquea la preparación del correo.

En los planes se preselecciona el plan correspondiente. Consulta prepara un `mailto:` a `CONTACT_EMAIL`; un plan prepara uno a `QUOTES_EMAIL`, con el nombre del plan en el asunto y los datos del formulario en el cuerpo. El usuario debe tener un programa de correo configurado, revisar el borrador y enviarlo desde allí. El sitio no envía ni almacena solicitudes, no muestra confirmaciones de envío y no integra SMTP ni APIs de correo. El backend y el panel administrativo para gestionar solicitudes quedan pendientes, sin diseñarlos en esta etapa.

Rutas disponibles: `/`, `/perfil/`, `/contacto/`, `/catalogo/`, `/catalogo/landing/`, `/catalogo/portal/` y `/componentes/`. La vitrina tiene título y descripción propios para buscadores; se accede desde el enlace posterior a los planes del catálogo. No se publican detalles de componentes ni rutas de demo. Las rutas `/api` y `/admin` ya no existen. Los planes desconocidos o desactivados no generan páginas y devuelven 404.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
