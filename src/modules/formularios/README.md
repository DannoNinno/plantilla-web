# Formularios en Cloudflare

## Flujo y garantías

El formulario público existente conserva el selector Consulta/plan y su diseño. Envía JSON a `POST /api/formularios/`. Los ejemplos de la bóveda siguen siendo demostraciones sin envío real.

El proyecto se actualizó de Next.js 15 a 16.4.3, con aprobación, porque OpenNext rechazaba la versión anterior fuera de soporte. Se retiró el proxy experimental con autorización: cada página y endpoint privado comprueba la autenticación antes de consultar datos. Las cabeceras privadas se definen en [next.mjs](../../infrastructure/configuracion/next.mjs). ESLint usa la configuración plana de Next.js 16 y los hooks de hidratación de la bóveda se adaptaron sin desactivar reglas.

`npm run build` valida Next.js; `npm run check` también empaqueta OpenNext. El paquete completo se verificó en Windows tras habilitar el dueño el Modo de desarrollador y aprobar `node-linker=hoisted` en [.npmrc](../../../.npmrc), reinstalando con el mismo lockfile y pnpm 9.15.9. No se instaló WSL ni se cambiaron permisos. Se mantienen visibles las advertencias generales de Windows/`DEP0190` del adaptador y de npm sobre la opción de pnpm.

1. Honeypot, validación Zod (incluida autorización explícita de privacidad) y límite de cinco solicitudes por IP en diez minutos.
2. Guardado completo en D1. El límite se vuelve a comprobar en la misma sentencia de inserción para evitar carreras.
3. Hasta dos intentos inmediatos del aviso interno usando `send_email`.
4. Éxito público solo después de guardar, aunque falle el aviso. El honeypot es la excepción deliberada.
5. Los avisos fallidos y pendientes se revisan y reenvían **manualmente** en el panel. No hay cron, colas ni tareas en segundo plano.

Cloudflare envía; Gmail es únicamente el buzón receptor. El formulario no pide correo al visitante y la API descarta `email`, `correo` o `replyTo` adicionales. Los avisos no contienen su email ni cabecera `Reply-To`. No se envían confirmaciones ni respuestas automáticas y no es posible responder por correo al visitante usando este formulario.

`enviado` significa que Cloudflare aceptó el aviso, no que Gmail confirmó su entrega o lectura. D1 es la fuente de verdad. Una reserva atómica de diez minutos impide dos reenvíos simultáneos; una reserva vencida puede recuperarse con otro intento manual. No se reenvían avisos ya confirmados como enviados. Si el proveedor acepta un correo pero se pierde su respuesta o falla la actualización de D1, un reintento podría duplicar el aviso: no existe garantía de envío exactamente una vez.

Si el proceso se interrumpe entre guardar y avisar, la solicitud queda pendiente en el panel. No hay recuperación automática posterior.

## Requisitos y configuración

- Workers con OpenNext, dominio con Email Routing activo y destino verificado en la misma cuenta Cloudflare.
- Base de datos D1 con binding `DB`.
- Binding `send_email` llamado `AVISO_EMAIL`, restringido al destinatario interno.
- Node.js 22 o superior para las herramientas; recomendado 24 LTS.
- pnpm 9.15.9, fijado en el manifiesto; conservar el lockfile y la configuración hoisted.

[formularios.config.ts](../../config/formularios.config.ts) concentra identidad, URL pública para los enlaces al panel, remitente, destinatario predeterminado, zona horaria, esquemas, asuntos y política antispam del módulo. Un tipo puede declarar `destino` para reemplazar el destinatario predeterminado; debe estar permitido por el binding y verificado en Cloudflare.

La configuración del sitio actual reutiliza su catálogo JSON y la validación de mensajes existente. Consulta obtiene el asunto «Consulta general» por defecto y Cotización traduce el identificador de un plan habilitado a su nombre en el servidor. En el payload se usan `nombre` y `mensaje` para consulta y `nombre`/`servicio`/`detalle` para cotización. Ambos requieren `consentimiento: true`; el servidor lo transforma en la versión de la política vigente y la guarda en `datos.consentimiento`, sin confiar en una versión enviada por el cliente. La interfaz usa una casilla obligatoria no premarcada, enlaza la política y ofrece el correo oficial para obtener respuesta. Se admite teléfono opcional en la API sin añadirlo a la interfaz actual. No se admite email entre los datos validados.

Solo los adaptadores y la integración HTTP conocen Cloudflare/Next/Drizzle. El núcleo es independiente de esas herramientas. Se usa el constructor estructurado con HTML y texto; no se necesita `mimetext`.

Referencias oficiales:

- [API de envío en Workers](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Restricciones de bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Destinos verificados y límites](https://developers.cloudflare.com/email-service/platform/limits/)
- [Límites de D1](https://developers.cloudflare.com/d1/platform/limits/)

Los avisos a destinos verificados no consumen cuota mensual ni límite diario de envío según la documentación consultada. Esto no elimina los límites de Workers, D1, tamaño de mensaje o los controles de abuso.

## Desarrollo local

Desde la raíz del proyecto:

```sh
npx pnpm@9.15.9 install --frozen-lockfile
```

Copia [.dev.vars.example](../../../.dev.vars.example) a `.dev.vars` en la raíz. Completa valores **locales** distintos de producción:

```dotenv
NEXTJS_ENV=development
IP_SALT=<aleatorio de al menos 32 caracteres>
ADMIN_SECRET=<otro aleatorio de al menos 32 caracteres>
ADMIN_PASSWORD=<contraseña de al menos 16 caracteres y como máximo 256>
```

No publiques estos valores. `.dev.vars*` está ignorado por Git salvo la plantilla de ejemplo. No uses valores de ejemplo en producción. En esta instalación ya se generaron valores aleatorios independientes para local y ensayo; no sobrescribas esos archivos al repetir el procedimiento.

```sh
npm run db:migrate:local
npm run dev
```

`next.config.mjs` ya inicializa `initOpenNextCloudflareForDev()`. Los scripts generan tipos de bindings automáticamente. D1 local persiste en `.wrangler/state/v3`; no es la base remota.

Abre `/contacto/`, envía una consulta y una cotización. Deben verse guardadas en `/admin/solicitudes/` tras entrar por `/admin/acceso/`. En desarrollo se imprime `[AVISO SIMULADO: solo desarrollo]` en la terminal: no se envía correo real. Ese estado simulado **no prueba entrega en Gmail**. La consola incluye el contenido de prueba, así que no introduzcas información privada real durante las pruebas.

El notificador de consola nunca se elige como reemplazo por un binding ausente en producción. Si falta el binding productivo, el aviso falla y queda registrado.

## Entornos remotos y publicación

Con autorización del dueño se crearon:

| Entorno | Worker | Base D1 | Estado |
| --- | --- | --- | --- |
| Producción | `dannotech` | `dannotech-db` | Publicación autorizada; comprobar migraciones y secretos antes de desplegar |
| Ensayo (`staging`) | `dannotech-ensayo` | `dannotech-ensayo-db` | Publicado, migrado y con secretos propios |

Los identificadores reales están en [wrangler.jsonc](../../../wrangler.jsonc). No vuelvas a crear estas bases. `staging` no tiene rutas de los dominios productivos y su autorreferencia apunta a su propio Worker. No se cambiaron DNS ni reglas de Email Routing.

Ensayo: <https://dannotech-ensayo.daniel-progra-work.workers.dev>. Accede por `/admin/acceso/`; la contraseña está en el archivo **local ignorado** `.dev.vars.staging`. Los tres secretos se cargaron solo a ensayo, sin imprimirlos. `FORMULARIOS_URL`, una variable no secreta de ese entorno, dirige los enlaces de los avisos al panel correcto.

### Migraciones

La migración inicial SQL está en [drizzle/](../../../drizzle) y ya se aplicó a local y a ambas bases remotas. Para cambios futuros, ejecuta `npm run db:generate`, revisa el SQL y respalda antes de aplicar:

La migración [0001_tearful_swordsman.sql](../../../drizzle/0001_tearful_swordsman.sql) permite `NULL` en la columna `email` anterior, conservando todos los registros y sus valores históricos. Las solicitudes nuevas ya no insertan email. Antes de publicar esta versión en ensayo y luego en producción, aplica las migraciones pendientes en el entorno correspondiente. La autorización se guarda en el JSON existente, sin otra migración.

```sh
npm run db:migrate:local
npx wrangler d1 migrations apply DB --remote --env staging
```

**Solo con autorización para producción**, después de probar en ensayo:

```sh
npx wrangler d1 migrations apply DB --remote
```

### Secretos y despliegues

Solo después de aprobar la publicación productiva, configura valores nuevos y exclusivos mediante las solicitudes interactivas de Wrangler:

```sh
npx wrangler secret put IP_SALT
npx wrangler secret put ADMIN_SECRET
npx wrangler secret put ADMIN_PASSWORD
npm run check
```

No subas `.dev.vars.staging` a producción. `IP_SALT` y `ADMIN_SECRET` deben tener al menos 32 caracteres aleatorios y la contraseña entre 16 y 256. En esta instalación los tres valores productivos se guardan localmente en `.dev.vars.production`, ignorado por Git, y son independientes de ensayo y desarrollo. Para rotar un secreto de ensayo usa el mismo comando con `--env staging`; no omitas ese selector.

Antes de publicar, comprueba que el destinatario configurado ya está verificado y coincide con `destination_address` en Wrangler, y que el remitente pertenece al dominio habilitado. No hace falta crear otra regla de recepción ni cambiar las reglas actuales de Email Routing.

`npm run deploy:staging` construye y publica **solo ensayo**. `npm run deploy` publica producción: no ejecutarlo hasta tener autorización. Usa el despliegue de OpenNext, no Wrangler directamente, porque el adaptador prepara los assets de caché.

El dueño autorizó integrar y publicar en `main`. Comprueba primero los secretos y migraciones: el flujo automático existente de Cloudflare puede publicar al integrar. La CI de GitHub solo valida; no despliega. Mantén el lockfile de pnpm como única fuente de versiones.

### Prueba real del aviso y del fallo

1. En ensayo, envía una consulta y una cotización ficticias, no información privada de clientes.
2. Comprueba registros en D1/panel y avisos en Gmail, incluyendo spam y asunto. La solicitud nueva debe tener `email=NULL`, y el aviso no debe contener email del visitante ni `Reply-To`.
3. Para probar un fallo real, con autorización para interrumpir temporalmente los avisos de ensayo, cambia **solo** `env.staging.send_email` a `[]` y despliega ensayo. Envía el formulario: debe mostrar éxito, quedar guardado y mostrar aviso fallido con dos intentos. No uses destinos no verificados ni modifiques producción.
4. Restaura inmediatamente el binding de ensayo, vuelve a desplegar ensayo y pulsa «Reenviar aviso» en su panel. Debe cambiar a enviado. Restaura siempre la configuración aunque la prueba falle.
5. Los tests automatizados reproducen ese fallo con un notificador falso y no envían correo real.

El dueño confirmó recepción de ambos correos de la versión anterior. Cada nueva publicación debe verificar de nuevo una consulta y una cotización sin email, acceso al panel y autorización de privacidad. No confundir la aceptación por Cloudflare con la confirmación del buzón. El fallo/reintento está cubierto por los tests del módulo; eso no equivale a probar una interrupción real del servicio remoto.

## Administración

- `/admin/acceso/`: contraseña única, límite de cinco intentos por IP cada diez minutos en D1.
- Sesión firmada con HMAC-SHA256, vencimiento de ocho horas, cookie `HttpOnly`, `SameSite=Strict` y `Secure` obligatorio fuera de desarrollo. El [Worker propio](../../../worker.ts) fuerza HTTPS remoto antes de ejecutar Next.js y añade HSTS; solo loopback permite HTTP. No hay `includeSubDomains` ni preload.
- Cada página llama a `exigirAdmin` y cada endpoint privado a `exigirAdminApi` antes de acceder a datos; las operaciones POST validan `Origin`. No hay dependencia de proxy. Las rutas administrativas responden con `private, no-store` y `noindex, nofollow`.
- `/admin/solicitudes/`: filtros, paginación de veinte registros, contador de avisos fallidos y solicitudes no leídas resaltadas.
- Detalle: todos los datos, errores, intentos, reserva, lectura y reenvío manual.
- Los registros conservan el hash salado de la IP, no la IP original. Esto es seudonimización, no anonimato: nombre, mensaje y, si se aporta mediante la API, teléfono pueden contener datos personales. Eliminar el campo email no garantiza cumplimiento normativo.
- Los correos almacenados antes del cambio no se borran automáticamente: siguen disponibles solo en el detalle privado como «Correo (registro anterior)». Las solicitudes nuevas no muestran ese campo. Un borrado histórico requiere decisión expresa sobre alcance y respaldos.

Al rotar `ADMIN_SECRET` se invalidan las sesiones existentes. Rotar `IP_SALT` cambia la identificación de IP para los límites nuevos. Por decisión del dueño no hay borrado automático: revisar y eliminar manualmente las consultas/cotizaciones sin contrato a más tardar doce meses desde el último contacto, incluyendo históricos y Gmail. Los registros de clientes siguen las obligaciones contractuales y legales. Revisar respaldos y reaplicar las eliminaciones al restaurar, conforme a la política pública.

### Supervisión y respaldos

- Observabilidad de Workers habilitada en Wrangler. Revisa Workers Logs en Cloudflare o `npx wrangler tail --env staging` para ensayo; sin `--env staging` observarías producción.
- Revisa periódicamente el contador de fallidos y las solicitudes pendientes del panel. El reenvío es manual; si nadie revisa, un aviso puede permanecer fallido indefinidamente.
- D1 ofrece [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) dentro de la ventana de tu plan. Antes de restaurar, selecciona la base y punto correctos y respalda su estado actual; una restauración puede descartar cambios posteriores.
- Para una copia SQL independiente de ensayo, crea una carpeta privada **fuera del repositorio** y ejecuta, por ejemplo en Windows:

  ```powershell
  npx.cmd wrangler d1 export DB --remote --env staging --output 'C:\RespaldosPrivados\dannotech\ensayo.sql'
  ```

  Para producción cambia a su archivo exclusivo y omite `--env staging`, solo con la autorización correspondiente. Protege los respaldos como datos personales, limita su acceso, verifica su restauración en una base aislada y no los añadas a Git ni los compartas junto con logs o secretos.

## Replicar en otro sitio

1. Prepara Workers/OpenNext, el dominio con Email Routing y el destino verificado de la cuenta del cliente.
2. Copia esta carpeta y crea una configuración basada en [formularios.config.ts](../../config/formularios.config.ts), adaptando sus imports del catálogo/validación del sitio.
3. Copia los conectores de rutas públicos/admin y las guardas de [proteccion.ts](./admin/proteccion.ts), o integra la autenticación administrativa existente. Cada nueva página/endpoint debe comprobarla antes de acceder a datos; conserva también las cabeceras privadas de Next.js.
4. Copia la configuración de Drizzle y las migraciones; crea D1 y configura bindings y secretos propios. Genera tipos con Wrangler.
5. Conecta el formulario existente al endpoint usando los componentes/hook de esta carpeta y prueba el flujo completo.

La carpeta del módulo no contiene direcciones ni marca del sitio. La configuración y los bindings externos son específicos de cada instalación. Copiar únicamente la carpeta no instala las rutas ni la protección: esos conectores también son necesarios.

Para agregar un tipo nuevo: amplía `TipoFormulario` y sus validadores/constraint de BD, agrega su esquema y asunto en la configuración, y adapta el formulario público. La plantilla genérica muestra todos los campos guardados. Genera y aplica la migración correspondiente. El registro actual está tipado deliberadamente para Consulta y Cotización; agregar otro tipo requiere esos ajustes explícitos.

## Pruebas

```sh
npm run test:formularios
npm run test:frontend
npm run test:proteccion
npm run check
```

Las pruebas del módulo usan D1 real emulado por Wrangler, aislado en memoria, y notificadores falsos: migraciones con preservación de registros históricos, validación, guardado antes de envío sin email, descarte de campos email adicionales, fallo de aviso, reenvío, límites concurrentes, reservas vencidas, filtros, lectura, escape HTML, destino interno sin `Reply-To` y autenticación. No usan credenciales ni bases remotas.

Los tests de protección examinan las rutas para evitar omitir las guardas al crear nuevos recursos privados. Los de runtime comprueban sesiones ausentes/manipuladas, cabeceras, orígenes ajenos, formato/tamaño de JSON y honeypot, sin enviar avisos reales:

```powershell
$env:TEST_BASE_URL = 'https://dannotech-ensayo.daniel-progra-work.workers.dev'
npm.cmd run test:runtime
```

Para probar el Worker local, aplica primero la migración local e inicia `npm run preview -- --port 3108`; en otra terminal utiliza `TEST_BASE_URL=http://localhost:3108`. No ejecutes migraciones locales mientras arranca el preview: ambos inicializan Miniflare y pueden bloquear la misma base SQLite.

La [CI Linux](../../../.github/workflows/validar.yml) ejecuta `npm run check` y el runtime local con credenciales efímeras y sin secretos remotos. Revisa su resultado en cada push autorizado. [Dependabot](../../../.github/dependabot.yml) propone revisiones mensuales sin actualizaciones mayores automáticas.
