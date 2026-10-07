<<<<<<< HEAD
# plantilla-web

Una plantilla base para un sitio web, este tendra todos los componontes por separado lsitos para probarse.
=======
# dannotech

Frontend en desarrollo con Next.js, React, TypeScript y Tailwind. Conserva la portada, perfil, catálogo, configurador local y estética de marca. Todo el contenido estructurado se obtiene de JSON locales; no hay API, autenticación, base de datos, administración ni procesamiento de Excel.

## Desarrollo

Requiere Node.js 20.19 o superior.

```sh
npm ci
npm run dev
npm run lint
npm run test:frontend
npm run build
```

La compilación exporta un sitio estático en `out`; no necesita un servidor de Next.js en producción. No hay comando `next start`: publica el contenido de `out` en un servidor de archivos estáticos o usa Docker.

Si un servidor de desarrollo bloquea `.next` en Windows, puedes validar sin detenerlo usando `$env:NEXT_BUILD_DIR = '.next-validation'` antes de `npm run build`. Con esa variable, la exportación queda en `.next-validation` en lugar de `out`. Sin la variable, la exportación habitual queda en `out`.

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

## Docker

```sh
docker compose up --build -d
```

La imagen construye el frontend y sirve la exportación estática con Nginx en `http://localhost:3000`, incluyendo la página 404 exportada. No necesita credenciales, volumen de datos, módulos SQLite nativos ni un proceso Node.js en producción.

Opcionalmente, configura `SITE_URL` al construir con Compose para los metadatos sociales. Fuera de Docker, utiliza `NEXT_PUBLIC_SITE_URL` antes de construir.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza. Docker debe validarse en un entorno con su motor disponible.
>>>>>>> main
