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
- Define `NEXT_PUBLIC_SITE_URL=https://dannotech.cl` en las variables del build; se utiliza en los metadatos.
- Comando de build: `npx opennextjs-cloudflare build`.
- Comando de despliegue, ejecutado por Cloudflare: `npx opennextjs-cloudflare deploy`.
- Usa el comando de despliegue del adaptador, no `wrangler deploy` directamente: OpenNext prepara también los assets de caché antes de publicar.
- Asocia `dannotech.cl` como dominio personalizado del Worker desde Cloudflare.

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
| [sitio.json](./src/data/sitio.json) | Marca, descripción, logo y contacto |
| [perfil.json](./src/data/perfil.json) | Identidad, experiencia, capacidades, formación, idiomas y proyectos |
| [paquetes.json](./src/data/paquetes.json) | Paquetes y sus descripciones |
| [componentes.json](./src/data/componentes.json) | Definiciones del configurador; actualmente vacío |
| [navegacion.json](./src/data/navegacion.json) | Enlaces de cabecera y pie |

Edita estos archivos para cambiar el contenido y vuelve a construir al publicar. Todo lo que incluyas es público: no agregues credenciales ni datos privados.

Las descripciones de paquetes son contenido del catálogo, no funcionalidades implementadas. El registro de componentes permanece vacío, sin inventar demostraciones. Las futuras definiciones pueden mostrar su nombre y descripción en la vista previa; no cargan datos del servidor ni módulos administrativos.

WhatsApp se muestra solo al configurar un número válido en `sitio.json`: dígitos con código de país, sin `+`, espacios ni guiones. El enlace de correo del perfil utiliza el correo de `perfil.json`.

El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

[globals.css](./src/app/globals.css) contiene solamente las tres directivas de Tailwind. Los componentes usan utilidades directamente, sin clases CSS propias, `@apply` ni hojas de estilos adicionales. La variante `fine-pointer` conserva los efectos hover solo para dispositivos con puntero preciso; las utilidades de foco y movimiento reducido mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios y selección

El formulario se conserva visualmente, con campos editables y sin avisos adicionales. El botón de envío está deshabilitado mientras no exista una implementación: no hace solicitudes, no guarda datos ni simula una confirmación.

El configurador mantiene su selección y resolución de dependencias únicamente en memoria del navegador. No persiste datos al salir ni modifica el sitio.

Rutas disponibles: `/`, `/perfil/`, `/catalogo/`, `/catalogo/landing/` y `/catalogo/portal/`. Las rutas `/api` y `/admin` ya no existen. Los paquetes desconocidos no generan páginas y devuelven 404.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
