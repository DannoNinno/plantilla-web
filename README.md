# dannotech

Sitio fullstack con Next.js, React, TypeScript y Tailwind sobre Cloudflare Workers/OpenNext. Conserva la portada, perfil, catálogo y estética de marca. El contenido público se obtiene de JSON locales; las consultas nuevas se entregan exclusivamente por correo, sin almacenarlas en el sitio. El panel administrativo protegido incluye un armador de simulaciones sin persistencia. No hay procesamiento de Excel.

## Desarrollo

Requiere Node.js 22 o superior para Wrangler; se recomienda Node.js 24 LTS, indicado en [.node-version](.node-version). [package.json](./package.json) fija pnpm 9.15.9. Usa Next.js 16.4.3; la actualización desde 15 fue necesaria para mantener una versión soportada por el adaptador. Cada página y endpoint privado autentica antes de consultar datos; no depende de proxy ni middleware experimental.

```sh
npx pnpm@9.15.9 install --frozen-lockfile
npm run dev
npm run lint
npm run test:frontend
npm run test:formularios
npm run test:proteccion
npm run test:simulacion
npm run build
npm run check
```

`npm run build` compila Next.js en `.next`. Ya no se usa `output: 'export'` ni se genera `out`: el despliegue está preparado para Cloudflare Workers con OpenNext.

En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd` y `npx.cmd` sin cambiar la política de ejecución. El empaquetado completo se verificó en Windows con el Modo de desarrollador habilitado por el dueño y `node-linker=hoisted` en [.npmrc](.npmrc). No se instalaron WSL ni herramientas globales, ni se cambiaron permisos del sistema. En una instalación nueva, si aparecen errores `EPERM` de symlinks, habilita personalmente ese modo o compila en Linux. No ejecutes builds sobre una carpeta `.next` utilizada por otro proceso ni operaciones Wrangler que inicialicen a la vez la misma base local.

`npm run lint` usa ESLint CLI sobre `src`, `tests` y `tailwind.config.ts`, con cero advertencias permitidas. [eslint.config.mjs](./eslint.config.mjs) mantiene las reglas de Next.js y Prettier con configuración plana; ya no se usa el comando deprecado `next lint`. `npm run lint:fix` aplica las correcciones automáticas con el mismo alcance. `npm run check` agrupa lint, tests del módulo/frontend/protección y el paquete completo de OpenNext, no solo el build de Next.js.

El adaptador aún muestra su advertencia general de soporte de Windows y puede emitir `DEP0190` al desplegar por su invocación interna de procesos con shell. pnpm 9 puede emitir `DEP0169` (`url.parse`) con Node.js 24. npm 11 avisa que no reconoce `node-linker`, una opción válida de **pnpm**. Son avisos de las herramientas, no fallos de compilación; no se silencian ni se modifican dependencias instaladas para ocultarlos. La configuración hoisted y el lockfile deben conservarse. pnpm es el único gestor de instalación: se retiró el segundo lockfile de npm para evitar versiones contradictorias. Se pueden seguir ejecutando scripts con `npm run`.

Se actualizaron Drizzle, OpenNext y Wrangler y se renovó `body-parser` dentro de su rango compatible. Los overrides acotados de `glob` (solo `@node-minify/core`) y `undici` (solo Miniflare) aplican parches de seguridad que esos padres aún fijan a versiones anteriores. Revisarlos al actualizar los padres. No se fuerzan cambios mayores de Tailwind o de las herramientas de migración para eliminar avisos moderados de desarrollo.

## Cloudflare Workers

La configuración está en [wrangler.jsonc](./wrangler.jsonc) y [open-next.config.ts](./open-next.config.ts). El Worker productivo se llama `dannotech` y sirve los archivos de `.open-next/assets`. El formulario usa `AVISO_EMAIL` (`send_email`) y `FORMULARIOS_LIMITE` (cinco intentos por minuto por hash de IP). `DB` (D1) se conserva para el límite de acceso, las sesiones administrativas y registros históricos, no para consultas nuevas. No usa KV ni R2.

Existen dos bases independientes: `dannotech-db` (producción) y `dannotech-ensayo-db` (ensayo). El entorno `staging` utiliza exclusivamente su propia base y el Worker `dannotech-ensayo`, sin rutas de los dominios productivos. Su URL es <https://dannotech-ensayo.daniel-progra-work.workers.dev>. Sigue el [procedimiento del módulo](./src/modules/formularios/README.md) y solicita autorización antes de publicar; un push a la rama conectada puede activar Workers Builds.

```sh
npx opennextjs-cloudflare build
npm run preview
npm run cf-typegen
```

El build del adaptador genera `.open-next/worker.js` y `.open-next/assets`. `preview` vuelve a compilar y ejecuta el sitio en el runtime local de Workers; no despliega. Los tipos generados, `.open-next`, `.wrangler` y los archivos `.dev.vars*` están excluidos de Git, excepto la plantilla vacía [.dev.vars.example](.dev.vars.example).

[worker.ts](./worker.ts) es el punto de entrada propio: redirige HTTP remoto a HTTPS conservando host, ruta y parámetros (301 en GET/HEAD, 308 en otros métodos), delega al Worker generado y añade HSTS de un año a sus respuestas HTTPS. Solo loopback conserva HTTP para desarrollo. No modifica el Worker generado ni usa proxy experimental. Los assets servidos directamente por Cloudflare pueden no pasar por este punto de entrada; la protección aquí cubre las páginas y endpoints delegados. La cookie administrativa siempre es `Secure`, incluso en desarrollo (usa `localhost` o HTTPS local).

`dev.host: "localhost"` evita que Wrangler reescriba las peticiones del preview local con el primer dominio productivo de `routes`. Así el preview y las pruebas HTTP locales siguen usando loopback sin excepciones remotas en la redirección HTTPS. Este ajuste no cambia el host del Worker desplegado.

Las páginas prerenderizadas utilizan la caché de solo lectura de Workers Static Assets, recomendada por la [guía de OpenNext para sitios SSG](https://opennext.js.org/cloudflare/caching#ssg-site). Esto permite servir los paquetes generados con `generateStaticParams` y `dynamicParams = false` sin recursos externos. No soporta revalidación: los cambios de JSON se publican con un nuevo build y despliegue. Los formularios y el panel son dinámicos y no usan esa caché para las solicitudes.

Para desarrollo, copia [.dev.vars.example](.dev.vars.example) a `.dev.vars` sin sobrescribir secretos existentes y completa valores aleatorios locales. Los tests usan un proveedor falso; el runtime local de Cloudflare no acredita recepción real en Gmail. No existe un notificador que vuelque consultas a la consola ni un reemplazo exitoso ante bindings ausentes. Los scripts de desarrollo, build y tests generan los tipos de los bindings. [public/_headers](./public/_headers) configura caché inmutable solo para `/_next/static/*`.

Los secretos de desarrollo, ensayo y producción deben ser distintos y mantenerse fuera de Git. `FORMULARIOS_URL` es una variable heredada: los correos nuevos no incluyen enlaces a solicitudes ni al panel.

Para Workers Builds conectado a GitHub:

- Usa Node.js 24 LTS para compilar.
- Cloudflare detecta pnpm e instala con `pnpm install --frozen-lockfile`. [pnpm-workspace.yaml](./pnpm-workspace.yaml) declara el proyecto raíz como único paquete; conserva `packages` para que pnpm 9 pueda leer la configuración y mantén [pnpm-lock.yaml](./pnpm-lock.yaml) sincronizado con las dependencias.
- El archivo versionado [.env.production](.env.production) define `NEXT_PUBLIC_SITE_URL=https://dannotech.cl` y `CLOUDFLARE_ENV=""`. Next.js usa la URL para metadatos y OpenNext carga la variable vacía antes de invocar Wrangler: selecciona explícitamente el entorno raíz (`dannotech`) y evita el aviso de múltiples entornos sin destino. Vacío no significa ausente. OpenNext 1.20.13 descarta el flag CLI vacío al reenviarlo, por lo que `--env=""` por sí solo no resuelve ese aviso. `deploy:staging` conserva `--env staging`, que tiene prioridad y selecciona `dannotech-ensayo`. No contiene secretos; los archivos `.env.local`, `.env*.local` y `.dev.vars` siguen excluidos de Git. Evita variables del entorno de build con otro valor, ya que tienen prioridad sobre este archivo.
- Mantén Next.js en una versión soportada por su política oficial (actualmente 16.x en este proyecto). OpenNext aborta el build si detecta una versión EOL; el flag `--dangerouslyUseUnsupportedNextVersion` existe, pero no se recomienda para producción.
- Comando de build: `npx opennextjs-cloudflare build`.
- Comando de despliegue, ejecutado por Cloudflare: `npx opennextjs-cloudflare deploy`.
- Usa el comando de despliegue del adaptador, no `wrangler deploy` directamente: OpenNext prepara también los assets de caché antes de publicar.
- [wrangler.jsonc](./wrangler.jsonc) declara `dannotech.cl` y `www.dannotech.cl` como dominios personalizados del Worker; Cloudflare los aplica en el siguiente despliegue. Mantiene `workers_dev: true` y desactiva las URL de preview con `preview_urls: false`.

`npm run deploy` está disponible para construir y desplegar en un solo comando, pero no es necesario ejecutarlo localmente cuando Cloudflare publica desde GitHub. Las imágenes siguen con `unoptimized: true`; no se requiere un binding de Cloudflare Images.

### Privacidad mínima y contacto

[La política pública](<./src/app/(portal)/privacidad/page.tsx>), el formulario y el correo comparten trece avisos configurables. La casilla obligatoria viene desmarcada; «Ver más» es una acción independiente. El servidor valida la aceptación y la versión vigente. El correo contiene la fecha/hora de Chile, el aviso aceptado y la fecha límite de eliminación. Se solicita teléfono, correo o ambos, según el canal elegido, sin autorizar publicidad.

Las consultas nuevas sin avance se eliminan manualmente del correo **a más tardar seis meses desde el envío**; el [procedimiento de Gmail](./src/modules/formularios/README.md#borrado-en-gmail) explica la revisión mensual y cómo anticiparla para no superar ese máximo. El cambio no elimina datos históricos de D1 ni sus respaldos, que requieren revisión según el aviso aplicable. No hay borrado automático ni certificación de cumplimiento legal; conviene revisión jurídica antes de publicar. No se añaden analítica, píxeles ni cookies de marketing.

### Validación continua y operación

[validar.yml](.github/workflows/validar.yml) ejecuta en Linux/Node.js 24 la instalación congelada, lint, tests, paquete Worker y pruebas HTTP contra un Worker local con credenciales temporales y D1 emulada. No usa secretos productivos ni despliega. Workers Builds es un proceso separado: revisa ambos resultados al publicar.

[dependabot.yml](.github/dependabot.yml) prepara revisiones mensuales de dependencias menores/parches y de Actions; no actualiza automáticamente versiones mayores ni integra cambios sin revisión. Las Actions están fijadas por commit.

Wrangler tiene observabilidad habilitada. El formulario registra solo eventos constantes de envío/fallo, nunca campos de la consulta ni errores crudos del proveedor. No habilites captura de cuerpos HTTP en herramientas externas. No existe una bandeja ni reenvío desde el panel: un fallo conserva los campos en pantalla y se informa al visitante. Protege cualquier respaldo histórico y reaplica las eliminaciones al restaurarlo.

## Organización

```text
src/
  app/                       Rutas, vistas y estilos globales
  data/                      Datos públicos en JSON
  domain/
    servicios/               Mensajes y enlaces de contacto
    types/                   Tipos de contenido y props del frontend
  infrastructure/
    componentes/
      portal/<nombre>/       Piezas exclusivas del portal dannotech
      boveda/                Piezas reutilizables para cualquier proyecto
        Base/                Botones, campos, contenedores y utilidades
        Secciones/           Secciones de contenido reutilizables
        Carousel/            Carrusel independiente del contenido
        EntradaScroll/       Entrada progresiva y enlaces entre secciones
        LoadingModal/        Indicador de carga compartido
        Formulario-contacto/ Formulario reutilizable con callback
        Cotizacion-pasos/    Cotización reutilizable con callback
    configuracion/           Configuración de Next.js
    handlers/datos.ts        Funciones simples que leen los JSON
```

Los [handlers de datos](./src/infrastructure/handlers/datos.ts) son funciones, no clases ni repositorios. Los JSON se importan directamente; no se consulta ninguna API para cargarlos. Los tipos del frontend permiten verificar su estructura durante la compilación.

### Dónde buscar o agregar un componente

- [portal](./src/infrastructure/componentes/portal): componentes exclusivos de dannotech. Contiene `Entrada`, `Header`, `Footer`, `FotoPerfil`, `Catalogo`, `DetallePaquete`, `Contacto` y `Vitrina`. Aquí se conectan la identidad, los planes y las reglas de este portal.
- [boveda](./src/infrastructure/componentes/boveda): componentes que pueden reutilizar dannotech y los portales de clientes. Incluye las bases visuales, secciones, carrusel, navegación entre secciones, entrada por scroll y carga. Los estilos compartidos de botones están junto a su componente en [Base/Boton](./src/infrastructure/componentes/boveda/Base/Boton).
- Una página de cliente debe componer piezas de la bóveda y aportar sus propios datos e integraciones; no debe importar componentes de `portal`. Que dannotech use una pieza no la vuelve exclusiva: si no contiene identidad ni reglas de ese negocio, pertenece a la bóveda.
- La interfaz y las integraciones internas del módulo de formularios permanecen encapsuladas en [modules/formularios](./src/modules/formularios). No son una biblioteca de componentes para clientes.

La dependencia permitida es `portal → boveda`, nunca `boveda → portal`. Las pruebas verifican la separación de carpetas y las importaciones de la bóveda. Esta clasificación no añade piezas al registro ni cambia las rutas públicas.

Las carpetas dentro de la bóveda comienzan con mayúscula, conservando los guiones: `Formulario-contacto`, `Cotizacion-pasos`, `Secciones/Portada` y `Base/Consulta`. Las importaciones deben respetar exactamente esas mayúsculas; los slugs del registro y las rutas públicas conservan sus nombres originales.

En Windows, un cambio que solo modifica mayúsculas debe registrarse en Git mediante un nombre temporal: `git mv ruta/original ruta/temporal` y luego `git mv ruta/temporal ruta/Original`. Cambiar el nombre solo en el explorador puede dejar el índice en minúsculas aunque el build local pase; Linux y Cloudflare sí distinguen esas rutas. Las pruebas verifican también los nombres versionados por Git.

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

Los [iconos de vitrina](./src/infrastructure/componentes/portal/Vitrina/iconos.ts) usan imports explícitos y claves estrictas; el handler rechaza iconos o planes mínimos inválidos del JSON. Cada descripción propuesta incluye un `TODO(Daniel)` en `revisionDescripcion`, visible en los datos pero no en la interfaz. La introducción también queda pendiente de revisión en `catalogo.json`; las etiquetas de disponibilidad no cambian los límites del plan.

El catálogo conserva los cuatro planes de [tarifas.md](./tarifas.md). El campo `habilitado` de [paquetes.json](./src/data/paquetes.json) controla su disponibilidad: Presencia Digital y Captación de Clientes están activos; Automatización de Procesos y Comercio Electrónico aparecen atenuados como «Próximamente», sin precio ni enlace. `getPaquetes()` conserva todos los datos para el catálogo; `getPaquetesHabilitados()` y `getPaquete()` solo exponen los activos para detalles, rutas estáticas y contacto. Los planes desactivados responden 404 y no se pueden cotizar en el formulario. Los servicios y costos adicionales aparecen al final del catálogo general. Al actualizar las tarifas, sincroniza los JSON con el documento; las pruebas conservan la verificación de precios y detalle de los cuatro planes.

Las rutas `landing` y `portal` se conservan para Presencia Digital y Captación de Clientes, respectivamente. Los dos planes se entregan en 7 días hábiles desde que el cliente entrega textos, logo y fotos, con hitos en los días 1, 4, 6 y 7. Presencia Digital incluye 1 página y Captación de Clientes hasta 5 páginas, ambas con hasta 6 secciones por página. El catálogo y el detalle explican cómo se cuentan páginas, exclusiones y cotización de páginas adicionales. El detalle mantiene `PresentacionPaquete`, `DetallePaquete`, `EnlacesPaquete` y `ConsultaPaquete`; esta última integra el formulario al final, con el plan preseleccionado. Contacto conserva el parámetro `?paquete=`.

[paquetes.json](./src/data/paquetes.json) define los precios finales con impuesto incluido: desde $177.000/$413.000 en dos pagos de 50 % o desde $150.000/$350.000 pagando todo al inicio. El descuento se comunica como **aproximado del 15 %** porque los montos comerciales no equivalen exactamente a multiplicar por 0,85; no se recalculan en la interfaz. [catalogo.json](./src/data/catalogo.json) concentra etiquetas y condiciones. El primer pago precede a la reunión inicial y el segundo a la publicación, que exige pago total. Solo Captación de Clientes incluye correo con dominio. Ambos planes incluyen 1 hora de ajustes tras la entrega, sin soporte adicional; el valor hora de cambios está por definir y se acuerda antes del pago, con ejecución en máximo 2 días hábiles posteriores. Sitio, dominio y cuentas quedan a nombre del cliente. Los planes desactivados y sus precios no cambian. En el home solo se aclara la modalidad y el impuesto junto al precio inicial, sin cambiar estructura ni estilos.

El diseño de referencia es `restore-point` (`8f384f3`, 9 de octubre de 2026). La reforma se incorpora sobre él, sin reemplazar sus páginas. El home conserva el hero con «Explorar el sitio», las cuatro secciones numeradas, ilustraciones, degradados y puertas de Catálogo y Perfil. El perfil conserva `FotoPerfil`, los botones Hablemos, Detalle técnico y LinkedIn, y la sección técnica; no incorpora `BeneficiosPyme`. El grupo de rutas `(portal)` conserva `SaltoContenido`. El interruptor `catalogoHabilitado` sigue controlando los enlaces, la etiqueta «Próximamente» y la redirección del catálogo.

`PaginaCatalogo` conserva sus piezas y concentra el contenido en presentación, planes, condiciones y adicionales. «Elige tu punto de partida» usa [CoverflowCarousel](./src/infrastructure/componentes/boveda/Carousel/CoverflowCarousel.tsx): tarjetas verticales, con la seleccionada centrada y sus vecinas reducidas y atenuadas; en móvil solo asoman por los bordes. Cada plan activo muestra resumen, precio y los cinco criterios de `comparacion` en una columna, seguidos de «Cotizar este plan» (a `/contacto?paquete=...`) y «Ver detalles». Las flechas a los lados y las tarjetas vecinas permiten seleccionar; debajo solo se muestra «Plan N de 4», sin indicadores numerados. También hay swipe horizontal y navegación con izquierda/derecha e Inicio/Fin al enfocar el carrusel. No hay bucle, avance automático ni scroll horizontal. Las transiciones duran 400 ms y se desactivan con movimiento reducido. Solo la tarjeta central permite interactuar con su contenido; las vecinas ofrecen un control de selección y el resto queda fuera del árbol accesible y del foco. El cambio se anuncia con `aria-live`. El componente recibe contenido y etiquetas sin depender de planes; [useCarousel](./src/infrastructure/componentes/boveda/Carousel/useCarousel.ts) concentra estado, límites, teclado y swipe. Los planes desactivados conservan nombre, resumen y «Próximamente», sin precio, prestaciones ni acciones. El enlace a todos los componentes queda al final del bloque.

El fondo de «Elige tu punto de partida» abarca toda esa sección, con cortes rectos, bordes superior e inferior y un degradado celeste–blanco–coral definido con utilidades Tailwind de la paleta de marca. No modifica los fondos de las demás secciones.

`CondicionesCatalogo` reúne «No solo desarrollo páginas web», «Gestión de alcance» y «Mis compromisos contigo» en una única superficie compacta, con todos los textos visibles, sin acordeones ni tarjetas separadas. Mantiene la animación de entrada y el ancla `#alcance` de los detalles de plan.

Los detalles conservan las grillas, tarjetas y animaciones de `restore-point`. El panel de administración ocupa una fila completa en la vitrina e incluye una descripción ampliada por puntos. Sus textos siguen siendo descriptivos, no activan una administración real.

Los correos oficiales se centralizan en [contacto.ts](./src/domain/configuracion/contacto.ts): `CONTACT_EMAIL` para contacto general y `QUOTES_EMAIL` para cotizaciones. No se guardan direcciones en los JSON ni se repiten en componentes. El footer, el perfil y los metadatos usan esta configuración; los enlaces se construyen como `mailto:` con asuntos codificados.

El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

Los botones comparten las variantes Tailwind de [estilos.ts](./src/infrastructure/componentes/boveda/Base/Boton/estilos.ts): color, sombra suave y desplazamiento breve al hacer hover con un puntero preciso, con respuesta equivalente al foco por teclado. Los efectos de movimiento respetan `prefers-reduced-motion` y los botones deshabilitados no se elevan ni muestran sombra.

El navbar identifica la sección actual con texto celeste, un subrayado fino y `aria-current="page"`. Catálogo permanece marcado en los detalles de sus planes; los enlaces inactivos solo cambian de color al hacer hover, sin un fondo adicional.

[globals.css](./src/app/globals.css) conserva las tres directivas de Tailwind y el bloque `@layer components` de animaciones de entrada. Es la única hoja de estilos: no se agregan hojas adicionales ni estilos inline. `EntradaScroll`, `data-entrada-elemento`, `data-entrada-paso` y `.entrada-ligera` mantienen la revelación progresiva y sus retrasos. La variante `fine-pointer` limita el hover a punteros precisos; el foco y `prefers-reduced-motion` mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios

La página `/contacto/` usa [FormularioConsulta](./src/infrastructure/componentes/boveda/FormularioConsulta/FormularioConsulta.tsx): nombre obligatorio; teléfono y/o correo; canal WhatsApp, llamada o correo; plan opcional con «Aún no lo sé»; mensaje de hasta 200 palabras con contador y límite defensivo de 10000 caracteres. Se valida en cliente y servidor. El wrapper [Contacto](./src/infrastructure/componentes/portal/Contacto/Contacto.tsx) aporta configuración y transporte; la pieza de bóveda no conoce el portal ni Cloudflare.

Las botoneras enlazan a `/contacto/?paquete=landing` o `/contacto/?paquete=portal`. Solo se preseleccionan planes activos; los desconocidos responden 404. `GET /api/formularios/` prepara un token firmado sin sesión persistida. `POST` comprueba origen, tamaño, campos, consentimiento, trampa, tiempo mínimo y límite de repetición; espera un único envío de Cloudflare al destinatario fijo. Si se aporta correo, se usa como `Reply-To`. No guarda consultas en D1, archivos, cachés ni logs ni introduce sus datos en URLs. No hay reintentos automáticos, cron ni colas. El éxito confirma aceptación del proveedor, no entrega o lectura en Gmail; un resultado ambiguo puede duplicarse si el visitante decide reintentar.

La [configuración pública](./src/domain/configuracion/consulta.ts) concentra identidad, plazos, aviso, proveedores, planes y WhatsApp; la [configuración del envío](./src/config/formularios.config.ts) define remitente, destino, asunto y zona horaria. El enlace directo de WhatsApp permanece desactivado hasta configurar un número del negocio; el visitante sí puede dejar su número para ser contactado por ese canal.

No se ejecuta una migración destructiva: los registros históricos de D1 permanecen, pero se retiraron su bandeja, detalle y endpoints de lectura/reenvío. El panel `/admin/`, protegido mediante `/admin/acceso/`, queda reservado para otros propósitos.

Rutas públicas: `/`, `/perfil/`, `/contacto/`, `/privacidad/`, `/catalogo/`, `/catalogo/landing/`, `/catalogo/portal/` y `/componentes/`. La vitrina tiene título y descripción propios para buscadores; se accede desde los detalles de los planes. No se publican detalles de componentes ni rutas de demo. Los planes desconocidos o desactivados no generan páginas y devuelven 404.

## Administración privada

El acceso se escribe directamente en `/admin/`: no hay enlaces desde la navegación pública, el pie ni `robots.txt`. Las páginas administrativas heredan `noindex, nofollow`; páginas y API también envían `X-Robots-Tag` y `Cache-Control: private, no-store`. Ocultar la dirección no sustituye la autenticación.

[administracion.json](./src/data/administracion.json) configura `rutaPanel`, `maximosFallos` (5), `bloqueoMinutos` (15) e `inactividadMinutos` (30). Cambiar la ruta requiere reconstruir y publicar: las reescrituras, enlaces, formularios, cookies y redirecciones usan ese prefijo. No elijas una ruta pública ya ocupada ni una ruta reservada de Next.js. Los handlers internos permanecen bajo `/api/admin/`, también protegidos.

[administracion](./src/modules/administracion) valida contraseña y firma HMAC, pero la vigencia depende de D1: cinco fallos consecutivos por hash de IP bloquean el acceso quince minutos, incluso con contraseña correcta. Un acceso correcto reinicia los fallos. La cookie es `HttpOnly`, `Secure`, `SameSite=Strict`, limitada al panel; la sesión vence tras treinta minutos sin actividad. El navegador sincroniza solo cuando detecta actividad; una consulta de vigencia no prolonga una sesión. El servidor rechaza renovaciones vencidas y el cierre de sesión revoca el registro, además de borrar la cookie. No se registran contraseñas ni cuerpos de formularios.

[LayoutPanel](./src/infrastructure/componentes/boveda/PanelAdministracion/LayoutPanel.tsx), su navbar y drawer son reutilizables: reciben marca, enlaces, menú, acciones y contenido. El adaptador [PanelAdmin](./src/infrastructure/componentes/portal/Administracion/PanelAdmin.tsx) conecta DannoTech, la salida y el estado de sesión. El navbar queda fijo; el drawer comienza cerrado, desplaza el contenido desde 1024 px y se superpone en móvil. Incluye Escape, foco contenido en móvil, retorno de foco y movimiento reducido. El inicio está vacío, sin tarjetas ni gestión de consultas.

La migración aditiva [0002_bright_blizzard.sql](./drizzle/0002_bright_blizzard.sql) crea `accesos_admin` y `sesiones_admin`, sin eliminar tablas ni históricos. Antes de publicar este código, aplica las migraciones a la base del entorno autorizado:

```sh
npm run db:migrate:local
npx wrangler d1 migrations apply DB --remote --env staging
npx wrangler d1 migrations apply DB --remote
```

Los dos comandos remotos corresponden a ensayo y producción respectivamente; ejecútalos únicamente cuando autorices ese entorno, con sus secretos `ADMIN_SECRET`, `ADMIN_PASSWORD` e `IP_SALT`. Cada página privada y el layout protegido deben comenzar con `await exigirAdmin()`; cada POST privado comprueba origen y sesión antes de cualquier operación. Las consultas continúan siendo exclusivamente por correo.

Las pruebas HTTP de inicio de sesión, bloqueo y revocación se habilitan con `TEST_ADMIN_PASSWORD` y solo admiten una URL loopback en `TEST_BASE_URL`. Usa credenciales locales de prueba, nunca las de producción. Sin esa variable, las demás pruebas HTTP siguen ejecutándose sin intentar autenticarse.

### Simulación de una página

El menú privado incluye **Simulación**, inmediatamente después de Inicio, con el icono `PanelsTopLeft` de Lucide. `/admin/simulacion/` conserva el layout administrativo y permite agregar, arrastrar, ordenar y quitar piezas del inventario. Los botones de subir/bajar ofrecen una alternativa sin arrastre.

[simulacion.ts](./src/infrastructure/handlers/simulacion.ts) concentra el esquema Zod, valores iniciales, adaptación del registro completo de la bóveda, reglas, codec, enlaces y comportamiento de navegación. Los componentes están fragmentados en [Simulacion](./src/infrastructure/componentes/portal/Simulacion). Los nombres, planes mínimos y cómputo se leen de la bóveda; los iconos se obtienen de las fichas comerciales existentes y se conservan al agregar las piezas a la plantilla. La emulación monta los componentes reales mediante el renderizador del registro y sus props ficticias existentes, sin copiar ni modificar la bóveda.

- Una sola página; no se repiten secciones. El máximo es seis secciones computables, incluida PORTADA; redes sociales no consume ese máximo.
- PORTADA se conserva como sección de la página, pero no genera enlaces en el navbar, sidebar ni menú móvil de la emulación. Si no hay otras secciones, no se muestra el botón de menú móvil vacío.
- `pagina.esLanding` es independiente del plan: activada, inserta PORTADA al inicio y bloquea moverla/quitarla. Desactivada, PORTADA es opcional y se puede ordenar libremente. Se inicia activada con PORTADA.
- Las piezas exclusivas de Captación requieren ese plan. Cambiar a Presencia o activar landing con una plantilla incompatible muestra el motivo sin eliminar contenido.
- Las piezas desactivadas muestran su motivo debajo: ya agregadas, exclusivas de otro plan o máximo alcanzado. Galería pertenece a ambos planes.
- El logo queda siempre a la izquierda; navegación y pie son oscuros; la muestra usa todo el ancho disponible. No hay selectores para estas tres decisiones. El menú móvil se elige con el switch **Menú móvil tipo drawer**; navegación, pie y WhatsApp conservan selects de tres opciones. El JSON mantiene `logo: izquierda`, `tema: oscuro` y `ancho: completo` para describir la muestra; los enlaces anteriores se normalizan a estos valores sin perder sus secciones.
- WhatsApp, pie de página y vista Google no aparecen en el inventario; WhatsApp y el pie se configuran como opciones visuales.
- `lz-string` comprime el JSON en `?c=`. La URL se actualiza al editar y restaura el estado al recargar; compártela solo con administradores autorizados. No hay guardado de simulaciones en D1, archivos ni localStorage. La URL y el historial contienen la configuración, por lo que no deben incluir datos sensibles.

**Simular** abre `/admin/simulacion/emular/?c=...` en la misma pestaña. Tanto la ida como **Volver a simulación** reemplazan la entrada actual del historial para no acumular páginas duplicadas. Su [grupo independiente](<./src/app/admin/(emulacion)>) verifica la misma sesión y mantiene el control de inactividad, sin navbar ni drawer administrativos. Emula navbar/sidebar/ninguna, navegación fija, transparencia sobre PORTADA, menú móvil desplegable o drawer, anclajes, scroll suave respetando movimiento reducido y sección activa con IntersectionObserver. Los componentes reales conservan su interacción local, pero el adaptador crea instancias con textos neutros (servicios, productos, preguntas y personas de ejemplo), logo DannoTech e imágenes con un icono nítido, fondo opaco y borde visible. No se muestran la marca, textos ni ilustraciones de Café Aurora y sus ejemplos originales no se modifican. La adaptación Tailwind se limita a la muestra: celeste suave, contenido sin el límite de ancho y un isotipo DannoTech difuminado al fondo, detrás del contenido y sin interceptar clics. Solo la marca de agua usa difuminado; las imágenes de la galería no. Su altura depende del contenido; PORTADA en vista landing ocupa como mínimo una pantalla. Los formularios son simulados, sin transporte ni persistencia. Los enlaces de ejemplo solo desplazan hacia secciones presentes; los destinos ausentes o externos muestran un aviso sin abrir sitios ni enviar mensajes.

Ambos grupos privados tienen un estado `loading` de Next.js con indicador accesible durante la carga real de la ruta y un `template` con entrada breve de opacidad. No se agregan demoras artificiales; se respeta movimiento reducido y no se transforma el contenedor de la navegación/dock fijos.

El dock tiene únicamente **Copiar JSON** (sin comprimir, con dos espacios de sangría) y **Volver a simulación**, conservando exactamente la configuración. El JSON exportado es una guía para otros agentes: conserva `v`, `plan`, `pagina` y `secciones`, y añade `componentes` en el mismo orden, con `key`, `nombre` y `descripcion` del catálogo. Las secciones desconocidas se identifican explícitamente como pendientes de revisión. Estos metadatos son solo de exportación; el esquema estricto y el JSON comprimido de la URL siguen usando únicamente la configuración. Los errores de URL, esquema o portapapeles se muestran explícitamente. Las keys desconocidas bien formadas se conservan para dibujar «Sección no encontrada», respetando el máximo de secciones. Los enlaces malformados no se sustituyen silenciosamente por valores iniciales.

`@dnd-kit/core` y `@dnd-kit/sortable` gestionan arrastre con puntero/teclado; `lz-string` gestiona el codec. Los estilos propios usan exclusivamente clases Tailwind. `npm run test:simulacion` comprueba inventario, opciones, reglas, codec, errores, enlaces y separación del layout; también forma parte de `npm run check`.

## Biblioteca reutilizable

El panel y su acceso usan fondos azul tinta, texto claro y acentos celestes/coral, sin superficies blancas. La marca gráfica se proporciona al layout como `ReactNode`: DannoTech utiliza el isotipo a color para fondo oscuro, no iniciales ni un logotipo tipográfico. Los controles y contenedores son rectangulares, incluida la opción Inicio del sidebar. Volver al sitio está junto al botón celeste de salida en el navbar; en pantallas pequeñas ambos conservan iconos y nombres accesibles sin desbordar. El navbar mide 5 rem, con una línea inferior en degradado de celeste a coral. El token `panel-header` mantiene alineados el contenido, drawer y fondo móvil sin cambiar la altura del encabezado público.

La biblioteca se concentra en [boveda](./src/infrastructure/componentes/boveda), con sus [secciones](./src/infrastructure/componentes/boveda/Secciones) y [bases compartidas](./src/infrastructure/componentes/boveda/Base). Es independiente de la vitrina comercial de [portal](./src/infrastructure/componentes/portal): esta solo describe la oferta y no monta piezas interactivas.

El [registro](./src/infrastructure/componentes/boveda/registro.ts) mantiene tipos, documentación de props, ejemplos e instancias editables en memoria. Los ejemplos consumen [ejemplos-boveda.json](./src/data/ejemplos-boveda.json) mediante un proveedor propio; las ilustraciones originales están en [public/ejemplos-boveda](./public/ejemplos-boveda). No dependen de módulos ni rutas de demo. Los tokens `seccion`, `canal`, `boveda-ancla` y `boveda-portada` de Tailwind pertenecen a esas piezas y no sustituyen la paleta del sitio.

Los formularios de ejemplo registrados validan sus props y usan callbacks locales, sin envío real. [FormularioConsulta](./src/infrastructure/componentes/boveda/FormularioConsulta/FormularioConsulta.tsx) es la pieza de integración reutilizable: recibe configuración y una función asíncrona de envío, sin endpoint ni marca incrustados. No se registra como ejemplo serializable porque su transporte es una función. Los ejemplos usan datos ficticios y enlaces internos. `npm run test:frontend` ejecuta las pruebas de UX y arquitectura de la biblioteca.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
