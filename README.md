# dannotech

Portal personal de Daniel Salamanca y base de sitios empaquetados para pymes chilenas. Next.js App Router, React, TypeScript y Tailwind; frontend y backend en una sola aplicación. No publica precios ni procesa pagos. La mantención es opcional.

## Desarrollo

Requiere Node.js 20.19 o superior (Docker usa Node.js 22).

```sh
npm ci
npm run dev
npm run lint
npm run test:platform
npm run build
```

Si un servidor de desarrollo mantiene bloqueado `.next` en Windows, puedes validar sin detenerlo usando `$env:NEXT_BUILD_DIR = '.next-validation'` antes de `npm run build`. Al terminar, elimina esa variable del entorno. El despliegue usa `.next` por defecto.

## Estado de esta versión

- Portada con entrada breve, salto y respeto por movimiento reducido.
- Perfil, catálogo y configuradores de Landing y Portal.
- **Registro de componentes vacío**, por decisión del propietario. La vista previa identifica explícitamente ese estado; no simula pedidos, noticias ni otras funciones.
- Formulario que guarda consultas en SQLite y panel de administrador único.
- Infraestructura de Excel disponible para los futuros contratos de los componentes.
- Perfil sin experiencia, competencias ni proyectos ficticios.
- WhatsApp oculto hasta configurar un número real.
- Poppins pendiente de sus archivos locales; se usa la fuente del sistema como alternativa. No se descargan fuentes ni se realizan solicitudes a Google Fonts.

## Configuración

| Archivo | Contenido |
| --- | --- |
| [sitio.ts](./src/configuracion/sitio.ts) | Nombre, persona, logo, colores, contacto, paquete y componentes activos |
| [paquetes.ts](./src/configuracion/paquetes.ts) | Landing y Portal, sin precios |
| [perfil.ts](./src/configuracion/perfil.ts) | Presentación, experiencia, competencias y proyectos |
| [registro.ts](./src/componentes/registro.ts) | Único registro de componentes disponibles |

WhatsApp usa solo dígitos, con código de país y sin `+`, espacios ni guiones. Los cambios de configuración forman parte de la aplicación y requieren reconstruirla en producción; el contenido administrable de cada componente vive en SQLite.

El kit original está en [public/dannotech-kit](./public/dannotech-kit). Nombre, colores y logo se aplican desde la configuración.

## Componentes futuros

Cada componente vive en `src/componentes/<nombre>/`:

```text
definicion.ts  Identidad, frase de negocio, paquetes/base/opcional y dependencias
Publico.tsx    Interfaz pública, reutilizada en la vista previa y en el sitio real
Admin.tsx      Administración, si corresponde
datos.ts      Acceso a datos, migraciones propias y contrato Excel, si corresponde
```

Los contratos están en [tipos.ts](./src/plataforma/componentes/tipos.ts). Una entrada del registro contiene `definicion`, `Publico`, `Admin` opcional, datos `demo` y un cargador `datos` opcional. **No hay entradas de ejemplo.**

El registro es exclusivo del servidor: las funciones de datos nunca llegan al navegador. El configurador recibe definiciones serializables y vistas públicas ya compuestas por el servidor; activa las vistas localmente, sin persistir la selección. `Publico` recibe `{ modo: 'sitio' | 'demo', datos }` y debe usar los datos de demostración cuando el modo es `demo`, sin escrituras ni llamadas al backend real.

Un componente no importa otro. Sus dependencias se declaran por identificador. Las bases vienen seleccionadas; las dependencias se activan con sus consumidores. Para activar una sección del sitio basta con añadir `<id>: true` a `sitio.componentes`. El panel se deriva de esos componentes activos, no de todos los disponibles. Si se retira una entrada y su carpeta, las referencias obsoletas se reportan explícitamente: se omite el componente no disponible y sus consumidores inválidos, conservando el resto. En la configuración del sitio real, cada dependencia debe estar activa explícitamente; una entrada desactivada no se vuelve a activar automáticamente. El panel informa la inconsistencia. Si se retira una entrada y su carpeta, las referencias obsoletas se reportan explícitamente: se omite el componente no disponible y sus consumidores inválidos, conservando el resto.

## Datos y contacto

`DATA_DIR` indica el directorio persistente (por defecto `./data`; en Docker `/data`):

```text
dannotech.sqlite      SQLite, modo WAL y migraciones
imagenes/            Reservado para los componentes que manejen imágenes
importaciones/       Archivos Excel originales, fechados y con identificador único
```

Las consultas del formulario se guardan localmente y se muestran en el panel. **No se envían correos automáticos.** Correo y WhatsApp de contacto están pendientes. Solo al enviar una consulta se guarda la selección del configurador. Hay límites de solicitudes para contacto e inicio de sesión.

Rutas públicas: `/`, `/perfil`, `/catalogo`, `/catalogo/landing`, `/catalogo/portal`. API: `GET /api/paquetes`, `GET /api/paquetes/[paquete]`, `POST /api/contacto`. Las rutas antiguas de productos y precios se eliminaron.

## Administrador único

No hay cuenta ni contraseña predeterminada. Para generar un hash en PowerShell:

```powershell
$clave = Read-Host 'Clave del administrador (minimo 12 caracteres)' -AsSecureString
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $clave).Password
npm run admin:hash
Remove-Item Env:\ADMIN_PASSWORD
```

Guarda el hash generado y `ADMIN_EMAIL` en `.env.local` para desarrollo o en variables de entorno al desplegar. No compartas el hash ni lo agregues a Git. El primer acceso a la configuración del panel crea el único administrador en SQLite. Después, sus credenciales persistidas son la fuente de verdad: cambiar las variables no sustituye una cuenta ya creada.

El acceso está en `/admin/login`. Las sesiones duran ocho horas, se guardan como hash y usan cookies HttpOnly/SameSite; en producción requieren HTTPS. El panel y cada endpoint administrativo comprueban la sesión por separado.

## Excel

Cada componente declara sus hojas, columnas en orden, validación de filas, importación y exportación mediante [ContratoExcel](./src/plataforma/excel/tipos.ts). No se impone una hoja Noticias ni un esquema de contenido antes de recibir las fichas.

- Solo `.xlsx`, hasta 5 MB y 5000 filas por hoja.
- Errores con hoja, número de fila, columna y mensaje.
- No se aceptan fórmulas ni valores complejos.
- Todas las filas se validan antes de escribir contenido.
- La importación se ejecuta dentro de una transacción SQLite síncrona.
- Cada archivo recibido se conserva y registra como recibido, inválido, importado o error.
- `POST /api/admin/componentes/[id]/excel` recibe el archivo en el campo `archivo`.
- `GET /api/admin/componentes/[id]/excel` exporta el contenido.
- Ambas rutas exigen sesión y un componente activo con contrato Excel.

## Docker

Configura `ADMIN_EMAIL` y `ADMIN_PASSWORD_HASH` en el entorno o en un `.env` local excluido de Git. Luego:

```sh
docker compose up --build -d
```

La imagen incluye las herramientas de compilación para `better-sqlite3` en su etapa de construcción; ejecuta Next.js standalone como usuario no privilegiado. El volumen `dannotech-data` conserva base, imágenes e importaciones. Usa **una sola réplica** y un proxy HTTPS; no compartas SQLite entre contenedores. Configura `SITE_URL` con el origen HTTPS público para validar envíos detrás del proxy. Compose usa también `SITE_URL` para los metadatos sociales al construir la imagen. Fuera de Docker, define `NEXT_PUBLIC_SITE_URL` antes de construir la aplicación. Para respaldar, detén la instancia y copia el volumen completo; no copies solo el archivo SQLite mientras tiene escrituras activas.

Docker debe validarse en un entorno con su motor disponible. Las pruebas locales cubren SQLite nativo, validación de Excel, reversión de transacciones y dependencias del registro.
