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
    (portal)/                Marco actual de dannotech; conserva sus URLs
    (demo)/                  Demo a página completa, sin cabecera/pie del portal
  data/                      Datos públicos en JSON
    demo/negocio.json        Fuente única del negocio ficticio Café Aurora
  demo/                      Adaptadores tipados y ensamblaje de ejemplos
  domain/
    casos-de-uso/             Selección local de componentes
    servicios/               Mensajes y enlaces de contacto
    types/                   Tipos de contenido y props del frontend
  infrastructure/
    componentes/<nombre>/    Componentes visuales
    componentes/base/        Piezas visuales compartidas
    componentes/boveda/      Componentes agnósticos y registro único
    componentes/demo/        Vistas de la bóveda y herramientas de demostración
    configuracion/           Configuración de Next.js
    handlers/datos.ts        Funciones simples que leen los JSON
```

Los [handlers de datos](./src/infrastructure/handlers/datos.ts) son funciones, no clases ni repositorios. Los JSON se importan directamente; no se consulta ninguna API para cargarlos. Los tipos del frontend permiten verificar su estructura durante la compilación.

El lint utiliza ESLint 9 con [configuración plana](./eslint.config.mjs); no se agregaron dependencias. `npm run lint` verifica también las pruebas y falla ante advertencias. La bóveda es independiente del antiguo configurador del catálogo.

## Bóveda y demostración — fase 1

- `/componentes/`: muestra directamente las piezas funcionales programadas, no tarjetas de secciones ni agrupaciones comerciales por plan. Por ahora permite probar el formulario de contacto.
- `/componentes/formulario-contacto/`: muestra la pieza aislada primero. La documentación de props y el plan mínimo están en «Información técnica», cerrada por defecto. Cada vista conserva un único h1.
- `/demo/presencia/` y `/demo/captacion/`: páginas completas de Café Aurora, sin la cabecera ni el pie de dannotech. Presencia muestra cinco secciones elegidas y Captación las ocho disponibles en fase 2. Ambas incluyen aviso visible y botonera flotante para cambiar de plan, volver al portal o a contacto con el plan preseleccionado.
- Portada vive en `secciones/portada`, solo forma parte de la demo del sitio y ya no tiene ficha pública en `/componentes/portada/`.

[negocio.json](./src/data/demo/negocio.json) es la fuente única del contenido ficticio y los textos de la demo. [negocio.ts](./src/demo/negocio.ts) solo lo importa. Los SVG originales incorporados por Daniel viven en [public/demo/cafe-aurora-demo/](./public/demo/cafe-aurora-demo/); las primeras dos fases usan logo, portada, fachada, galería y la ilustración de la sede principal. Los activos de equipo, productos, novedades y promoción quedan disponibles para Captación. El manifest describe activos; no es otra fuente de contenido de negocio.

Cada pieza tiene carpeta, props exportadas, ejemplo y README con dependencias de copia. El código del componente no importa su ejemplo, el registro ni el negocio. Para llevarlo a otro proyecto se copian la carpeta, las piezas base indicadas y los tokens de Tailwind; no hay que modificar el código. La bóveda está destinada a piezas funcionales: formularios, carruseles, navbars, sidebars, módulos de noticias u otras piezas que Daniel aporte. Las secciones comerciales se ensamblan en la demo del plan, no se presentan como componentes de la bóveda.

[registro.ts](./src/infrastructure/componentes/boveda/registro.ts) mantiene una única lista tipada, sin duplicar componentes ni ejemplos. `categoria: 'componente'` publica una pieza en la bóveda; `categoria: 'seccion'` no genera ficha pública. `registroBoveda` es una vista filtrada, no un segundo inventario. `enDemo` decide explícitamente si la entrada se ensambla en las demos: una nueva pieza de la bóveda no debe aparecer automáticamente en Café Aurora. [planes.ts](./src/demo/planes.ts) deriva el orden, filtra por plan y aplica topes de 5 y 10; las piezas siempre incluidas no consumen el límite.

El formulario de ejemplo solo valida y muestra éxito en memoria: no tiene peticiones, login, almacenamiento ni envíos de correo. Sin JavaScript no permite enviar y muestra un aviso. El formulario real de dannotech sigue separado y abre el programa de correo.

La botonera inferior es una tarjeta compacta y centrada, con fondo azul oscuro, sombra y cuatro acciones con iconos. Coral identifica las acciones de dannotech (cotizar y volver al portal); celeste identifica los planes, con un indicador del plan activo. Las etiquetas cortas vienen del JSON y cada enlace conserva su nombre accesible completo. El aviso superior es una pequeña cápsula del mismo color: su detalle sigue disponible para lectores de pantalla y como tooltip. Ambos controles son overlays fijos sin franjas de fondo; el contenido se desplaza por debajo y el espacio transparente permite hacer clic en la demo. El contenido tiene padding inicial y final, y un hook mantiene el campo enfocado entre los límites reales de los overlays al navegar con teclado. Solo este marco necesita una frontera cliente; las secciones siguen entrando como contenido de servidor. El aviso no se repite dentro de la botonera. En la bóveda el formulario mantiene su aviso propio de simulación, sin agregar otra franja de demo.

Las cuatro acciones crecen un 5 % al hacer hover con mouse o recibir foco visible, con una transición de 150 ms y regreso al tamaño normal al pulsar. Con movimiento reducido no se aplica escala ni transición; no se ejecutan animaciones en bucle ni lógica JavaScript para el hover.

El portal, la bóveda y las secciones de la demo comparten `fontFamily.sans`, igual que la landing y el perfil. `TituloSeccion` usa ese token: no introduce fuentes serif ni una tipografía distinta para Café Aurora. El logo y las ilustraciones originales siguen siendo imágenes y no alteran la fuente del marcado.

### Archivos nuevos de fase 1

```text
eslint.config.mjs
public/demo/cafe-aurora-demo/          Kit SVG aportado por Daniel, conservado
src/
  app/
    (portal)/
      layout.tsx
      componentes/page.tsx
      componentes/[slug]/page.tsx
    (demo)/
      layout.tsx
      demo/[plan]/page.tsx
  data/demo/negocio.json
  demo/
    negocio.ts
    planes.ts
  infrastructure/componentes/
    Contacto/PaginaContacto.tsx
    base/
      Boton/Boton.tsx
      Contenedor/Contenedor.tsx
      SaltoContenido/SaltoContenido.tsx
      TituloSeccion/TituloSeccion.tsx
    secciones/
      portada/
        Portada.tsx
        tipos.ts
        ejemplo.ts
        props.ts
        index.ts
        README.md
    boveda/
      registro.ts
      formulario-contacto/
        FormularioContacto.tsx
        FormularioInteractivo.tsx
        CampoContacto.tsx
        ResultadoContacto.tsx
        useFormularioContacto.ts
        validacion.ts
        tipos.ts
        ejemplo.ts
        props.ts
        index.ts
        README.md
    demo/
      AvisoDemo/AvisoDemo.tsx
      PaginaPlan/MarcoDemo.tsx
      PaginaPlan/useEnfoqueDemo.ts
      FichaComponente/FichaComponente.tsx
      FichaComponente/TablaProps.tsx
      HerramientasDemo/HerramientasDemo.tsx
      HerramientasDemo/AccionHerramienta.tsx
      HerramientasDemo/SelectorPlan.tsx
      IndiceBoveda/IndiceBoveda.tsx
      IndiceBoveda/MuestraComponente.tsx
      PaginaPlan/PaginaPlan.tsx
tests/boveda.test.ts
```

Las rutas de inicio, perfil, contacto y catálogo, junto con el template existente, se movieron a `(portal)` para conservar su marco visual. Además se actualizaron los scripts de lint/pruebas, la configuración de tokens y las pruebas de estructura.

## Demostración — fase 2

Se completaron las seis secciones restantes de Presencia Digital: Servicios, Quiénes somos, Galería, Testimonios, Preguntas frecuentes y Ubicación y horarios. No se publican en la bóveda de piezas funcionales. Sus tarjetas, imágenes y preguntas están fragmentadas en subcomponentes dentro de cada carpeta.

Daniel eligió esta composición para `/demo/presencia/`, en este orden:

1. Portada.
2. Servicios.
3. Quiénes somos.
4. Testimonios.
5. Formulario de contacto.

La selección vive en `interfaz.planes.presencia.secciones` del JSON. `seleccionarComposicion` valida nombres, duplicados, disponibilidad y el límite real de cinco; no descarta silenciosamente una configuración inválida. `/demo/captacion/` permite explorar las ocho secciones disponibles (menos de su tope de diez), sin implementar aún las funciones avanzadas ni el panel.

WhatsApp, redes sociales y pie de página se incluyen siempre y no consumen el límite. Sus destinos de ejemplo son internos: WhatsApp y las redes llevan al formulario simulado, no a números, cuentas ni perfiles reales. El nombre accesible del botón y el aviso de redes explican esta simulación. El pie tiene identidad propia de Café Aurora y retorno al inicio. El contacto real de dannotech no se modifica.

### Archivos incorporados en fase 2

```text
src/infrastructure/componentes/
  base/MarcoSeccion/MarcoSeccion.tsx
  boveda/
    registrar.ts
    formulario-contacto/definicion.ts
  secciones/
    portada/definicion.ts
    servicios/
      Servicios.tsx
      TarjetaServicio.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    quienes-somos/
      QuienesSomos.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    galeria/
      Galeria.tsx
      ImagenGaleria.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    testimonios/
      Testimonios.tsx
      TarjetaTestimonio.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    preguntas-frecuentes/
      PreguntasFrecuentes.tsx
      PreguntaFrecuente.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    ubicacion-horarios/
      UbicacionHorarios.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    whatsapp/
      Whatsapp.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    redes-sociales/
      RedesSociales.tsx
      EnlaceSocial.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
    pie-pagina/
      PiePagina.tsx
      tipos.ts
      ejemplo.ts
      definicion.ts
      index.ts
      README.md
```

También se ampliaron el JSON, el ensamblaje por plan, el registro, las pruebas y los textos de estado del catálogo. Cada definición aporta metadatos y props tipadas desde su carpeta; `registro.ts` sigue siendo la única lista y `registrar.ts` solo conserva el enlace genérico entre componente y props, para que el registro no crezca por encima de 150 líneas. Al copiar una sección se excluyen `ejemplo.ts` y `definicion.ts`.

### Decisiones de implementación

- Galería estática con imágenes diferidas, sin carrusel, autoplay ni otra carga de JavaScript.
- Preguntas frecuentes con `details`/`summary`: funcionan con teclado y sin JavaScript.
- Dirección ilustrada, sin mapas externos ni coordenadas reales.
- Opiniones claramente ficticias, sin atribuirlas a personas reales.
- Las secciones nuevas son de servidor, comparten la tipografía del portal y reciben todo el contenido por props.
- Nuevo token `canal.whatsapp` y margen de anclas de cuatro rem para evitar que el aviso fijo tape los destinos.
- No se agregaron dependencias, hojas de estilo, animaciones en bucle, backend ni commits.

### Validación de fase 2

49 pruebas aprobadas, lint sin advertencias y build de producción correcto. Se verificaron las composiciones de cinco y ocho secciones, las tres piezas sin consumo de cupo, un h1 por demo y ausencia de desplazamiento horizontal a 360, 768 y 1440 px. Las preguntas responden al teclado; el formulario muestra éxito local, enfoca su resultado y no realiza XHR, fetch ni POST. El ancla de contacto queda debajo del aviso fijo y la bóveda conserva solo el formulario funcional. Los recursos nuevos existen y los SVG comprobados responden con HTTP 200.

### Pendientes

- TODO(Daniel): revisar la fase 2 y sus cambios sin commit antes de avanzar a Captación.
- TODO(Daniel): implementar en fase 3 las piezas de Captación, edición simulada de textos/imágenes y Bandeja de contactos conectada a `onConsulta`.
- TODO(Daniel): aportar futuras piezas de la bóveda; revisar sus dependencias y props antes de incorporarlas, sin implementar autenticación real en estas demos.

### Revisión de estándares

Las piezas nuevas mantienen un archivo por componente, lógica del formulario en un hook, Tailwind sin hojas nuevas ni estilos en línea, y páginas que solo ensamblan. El catálogo y los detalles de plan se fragmentaron al autorizar su conexión con las demos; conservan los precios, contenidos de servicio y consulta existentes. La página preexistente de perfil solo se trasladó: conserva marcado de secciones y más de 150 líneas, sin refactorizarla fuera del alcance autorizado. La única hoja existente sigue siendo [globals.css](./src/app/globals.css).

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

Las descripciones de paquetes son contenido del catálogo, no funcionalidades implementadas. El registro JSON del configurador heredado permanece vacío y no se conecta a las nuevas demos. La bóveda usa su propio registro TypeScript para las piezas reutilizables y sus ejemplos; ninguno carga datos del servidor ni módulos administrativos reales.

El catálogo organiza los cuatro planes de [tarifas.md](./tarifas.md), con precios desde en CLP, un resumen por opción y vistas de detalle para su alcance, reuniones, capacitación, exclusiones y consideraciones según corresponda. Los servicios y costos adicionales aparecen al final del catálogo general. Los contenidos públicos se mantienen en los JSON; al actualizar las tarifas, sincroniza esos datos con el documento. Las pruebas verifican que los precios y el detalle de cada plan coincidan con la fuente. El catálogo está habilitado mediante `catalogoHabilitado` en [sitio.json](./src/data/sitio.json): el menú y la tarjeta de inicio usan sus enlaces existentes, sin modificar el home.

La sección «Explora antes de cotizar» diferencia dos recorridos: catálogo → detalle del plan → demo del sitio correspondiente, y catálogo → bóveda → componente aislado. Presencia Digital (`landing`) abre `/demo/presencia/`; Captación de Clientes (`portal`) abre `/demo/captacion/`. La relación con los planes del catálogo vive en el JSON de la demo y se consulta con `getDemoPaquete`; Automatización y Comercio Electrónico no muestran demos que aún no existen. El detalle ofrece también acceso a la bóveda y un aviso de funciones pendientes para no presentar como terminado el panel ni otras funcionalidades de Captación. Los textos de este recorrido están en [catalogo.json](./src/data/catalogo.json).

Los archivos de página del catálogo solo ensamblan. Su presentación se separa en [Catalogo](./src/infrastructure/componentes/Catalogo) (presentación, filosofía, exploración, lista y tarjeta de planes, alcance, principios y adicionales) y [DetallePaquete](./src/infrastructure/componentes/DetallePaquete) (presentación, detalle existente, enlaces y consulta). Son componentes de servidor con props tipadas y clases Tailwind, sin hojas de estilo nuevas.

Las rutas `landing` y `portal` se conservan para Presencia Digital y Captación de Clientes, respectivamente. Ambos planes tienen un plazo de hasta 5 días hábiles, con las reuniones incluidas dentro de ese período. El configurador se muestra solo si el plan tiene componentes definidos; de lo contrario, se presenta el detalle y el formulario, sin una demostración vacía ni canales de contacto adicionales dentro del plan.

Los correos oficiales se centralizan en [contacto.ts](./src/domain/configuracion/contacto.ts): `CONTACT_EMAIL` para contacto general y `QUOTES_EMAIL` para cotizaciones. No se guardan direcciones en los JSON ni se repiten en componentes. El footer y los metadatos usan esta configuración; los enlaces se construyen como `mailto:` con asuntos codificados.

La foto del perfil se carga desde `public/perfil/daniel-salamanca.png`; si no está disponible, se muestran las iniciales. La sección Demos del perfil permanece oculta mediante `demosHabilitadas` en [sitio.json](./src/data/sitio.json); ese flag no oculta las nuevas rutas independientes de la bóveda y Café Aurora. El kit visual original está en [public/dannotech-kit](./public/dannotech-kit). Se conservan estilos, colores, animaciones y movimiento reducido. Poppins sigue pendiente de sus archivos locales; se usa la fuente del sistema y no se descargan fuentes externas.

La portada presenta tres bloques de servicios y un cuarto de entradas, cada uno con un mínimo de 70vh y scroll libre. Las ilustraciones SVG alternan derecha/izquierda/derecha en escritorio y aparecen arriba del texto en móvil. La tarjeta del catálogo desactivado usa tonos grises, un indicador de bloqueo y la etiqueta «Próximamente», sin interacción. En el perfil, la ficha profesional permanece debajo de la foto dentro de la presentación azul; la tabla de capacidades y la trayectoria quedan más abajo, bajo «Detalle técnico». Los textos mantienen un tono cercano y directo.

Cada bloque de la portada tiene un degradado diferenciado (celeste, azul, coral suave y gris azulado) y un encabezado discreto del 01 al 04. No hay enlaces Siguiente ni stepper: el cuarto bloque presenta las elecciones Catálogo/Perfil. «Explorar el sitio» comienza en el primer bloque y conserva su ancla sin JavaScript, respetando la cabecera fija. El recorrido permite scroll libre; una rueda, gesto táctil, interacción de teclado o nuevo clic puede interrumpir el desplazamiento suave del enlace. Con movimiento reducido, el salto es inmediato. Las secciones son visibles sin JavaScript.

## Estilos

La paleta tiene una única fuente en [tailwind.config.ts](./tailwind.config.ts): `coloresMarca`. Allí también se definen los tonos derivados, degradados, tipografía, altura de cabecera, transiciones y animaciones. Los metadatos usan esa misma paleta; los colores no se duplican en JSON ni se inyectan mediante estilos inline.

Los fondos `intro` y `confianza` comparten una base azul ligeramente aclarada, con luces radiales diferentes. `servicios` y `proceso` combinan degradados lineales con acentos radiales más intensos en celeste y coral; `entradas` conserva un degradado suave. El fondo del perfil permanece independiente; ajustar los bloques de la home no modifica su presentación.

Los botones comparten las variantes Tailwind de [estilos.ts](./src/infrastructure/componentes/Boton/estilos.ts): color, sombra suave y desplazamiento breve al hacer hover con un puntero preciso, con respuesta equivalente al foco por teclado. Los efectos de movimiento respetan `prefers-reduced-motion` y los botones deshabilitados no se elevan ni muestran sombra.

La presentación anima solo el título durante 450ms si no se solicita movimiento reducido. Cada bloque de la portada aparece una vez con un fundido de 250ms aplicado solo a su contenido directo: sin blur, desplazamiento ni escalonamiento de elementos. Las tarjetas de salida mantienen sus colores interactivos sin desenfoque de fondo.

El navbar identifica la sección actual con texto celeste, un subrayado fino y `aria-current="page"`. Catálogo permanece marcado en los detalles de sus planes; los enlaces inactivos solo cambian de color al hacer hover, sin un fondo adicional.

[globals.css](./src/app/globals.css) contiene las directivas de Tailwind y las reglas de entrada por scroll. El componente [EntradaScroll](./src/infrastructure/componentes/EntradaScroll/EntradaScroll.tsx) usa IntersectionObserver y activa las clases solo después de cargar JavaScript: el contenido es visible sin JavaScript o con movimiento reducido. La entrada por scroll ocurre una sola vez al ver el 20% del bloque; si una sección supera cinco ventanas de alto, se revela al llenar la ventana para que las tablas largas no queden ocultas. El foco por teclado también revela el contenido. Perfil, catálogo y detalles de planes conservan la transición de 600ms con opacidad, desplazamiento y blur; la portada usa solo un fundido de 250ms. No hay scroll-snap ni bloqueo del scroll.

El resto de los estilos utiliza utilidades Tailwind, sin `@apply` ni hojas de estilos adicionales. La variante `fine-pointer` conserva los efectos hover solo para dispositivos con puntero preciso; las utilidades de foco y movimiento reducido mantienen la accesibilidad.

Las capacidades del perfil resaltan su fondo, acento lateral e icono al hacer hover. Todas comparten el mismo movimiento breve del icono, dibujo de trazos y destello. Los iconos de formación e idiomas mantienen la inclinación y elevación; el título principal tiene un desplazamiento horizontal suave que vuelve a su posición original. Los efectos no usan bucles ni JavaScript y los movimientos solo se activan con puntero preciso y cuando no se solicita movimiento reducido.

## Formularios y selección

La página `/contacto/` contiene el formulario compartido, con nombre, correo, un selector de los cuatro planes y la opción Consulta, y un mensaje de hasta 200 palabras. Tiene una única acción principal y no muestra la dirección destinataria ni enlaces de correo adicionales dentro del formulario. El footer mantiene el enlace `mailto:` con la dirección `contacto@dannotech.cl`. El límite se valida por palabras (separadas por espacios, tabulaciones o saltos de línea), no por caracteres; al excederlo se informa el error y se bloquea la preparación del correo.

En los planes se preselecciona el plan correspondiente. Consulta prepara un `mailto:` a `CONTACT_EMAIL`; un plan prepara uno a `QUOTES_EMAIL`, con el nombre del plan en el asunto y los datos del formulario en el cuerpo. El usuario debe tener un programa de correo configurado, revisar el borrador y enviarlo desde allí. El sitio no envía ni almacena solicitudes, no muestra confirmaciones de envío y no integra SMTP ni APIs de correo. El backend y el panel administrativo para gestionar solicitudes quedan pendientes, sin diseñarlos en esta etapa.

El configurador mantiene su selección y resolución de dependencias únicamente en memoria del navegador. No persiste datos al salir ni modifica el sitio.

Rutas disponibles: `/`, `/perfil/`, `/contacto/`, `/catalogo/`, los detalles `/catalogo/landing/`, `/catalogo/portal/`, `/catalogo/automatizacion/` y `/catalogo/comercio-electronico/`, `/componentes/`, las fichas `/componentes/[slug]/` y las demos `/demo/presencia/` y `/demo/captacion/`. Si se desactiva el flag del catálogo y se reconstruye el sitio, sus rutas vuelven a redirigir a `/`. Las rutas `/api` y `/admin` ya no existen.

## Docker anterior

[Dockerfile](./Dockerfile), [compose.yaml](./compose.yaml) y [nginx.conf](./nginx.conf) se conservan como configuración histórica del despliegue estático. Esperan una carpeta `out` y no son compatibles con el build actual de Workers; no los uses para este despliegue. No se han modificado como parte de la migración.

Las bases de datos o archivos persistidos de versiones anteriores no se borran automáticamente. El frontend ya no los utiliza.
