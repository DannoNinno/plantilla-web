# Consultas por correo en Cloudflare

## Flujo y garantías

Las consultas nuevas se envían exclusivamente al correo configurado. No se insertan en D1 ni se guardan en archivos, cachés o logs del sitio. El contenido existe transitoriamente en memoria para validarlo y construir el correo; Cloudflare y el buzón receptor intervienen como proveedores.

1. `GET /api/formularios/` entrega un token firmado con fecha, sin persistir una sesión.
2. `POST /api/formularios/` valida origen, contenido JSON, tamaño, campos, canal, plan activo y consentimiento de la versión vigente.
3. La trampa oculta descarta bots. El token exige al menos tres segundos desde su emisión y vence a las dos horas. El binding `FORMULARIOS_LIMITE` limita a cinco intentos por minuto mediante hash salado de IP, sin almacenar la consulta. Es el límite nativo distribuido de Cloudflare, no una garantía global exacta.
4. Se espera un único `AVISO_EMAIL.send`. Solo su aceptación permite mostrar éxito. Si falla, se informa al visitante y se conservan los campos. No hay notificador de consola, guardado de respaldo, reenvíos administrativos ni reintentos automáticos.

El destino y remitente son fijos en el servidor. El asunto comienza con un prefijo filtrable y añade plan y nombre. `Reply-To` utiliza el correo del visitante únicamente si lo aportó. Texto y HTML escapado incluyen datos, canal, consentimiento, versión, fecha/hora de Chile, fecha límite de borrado y los trece puntos aceptados.

La aceptación del proveedor **no acredita recepción ni lectura en Gmail**. Si acepta el correo pero se pierde su respuesta, un reintento voluntario puede duplicarlo; no se promete entrega exactamente una vez. Los logs propios solo contienen eventos constantes, nunca datos ni errores crudos del proveedor. No habilites captura de cuerpos HTTP ni depuración de contenido en servicios externos.

## Configuración y reutilización

- [consulta.ts](../../domain/configuracion/consulta.ts): responsable, negocio, correo de contacto/derechos, meses de conservación, plazo de respuesta, proveedores, procesamiento internacional, versión/fecha, planes activos y WhatsApp.
- [formularios.config.ts](../../config/formularios.config.ts): remitente, destinatario interno, prefijo del asunto, zona horaria y tiempos antispam.
- [wrangler.jsonc](../../../wrangler.jsonc): restricciones del destinatario, bindings y namespaces separados para producción y ensayo.
- [FormularioConsulta](../../infrastructure/componentes/boveda/FormularioConsulta/FormularioConsulta.tsx): interfaz agnóstica con `config`, `enviar`, `preparado` y plan inicial opcional. [Contacto](../../infrastructure/componentes/portal/Contacto/Contacto.tsx) conecta el portal y el hook HTTP.

El nombre es obligatorio; teléfono/correo son opcionales por separado, pero debe existir el dato del canal elegido. El plan puede quedar vacío; el mensaje admite hasta 200 palabras y 10000 caracteres. La casilla está desmarcada inicialmente y es independiente de «Ver más». Formulario, política y correo comparten el generador de trece avisos.

Para otro negocio, proporciona su configuración y transporte a la pieza de bóveda; si usas este backend, adapta también la configuración del servidor y los bindings del cliente. No se necesita D1 para consultas públicas. Los ejemplos antiguos registrados en la bóveda son demostraciones locales, no envíos de correo.

El enlace directo a WhatsApp está desactivado hasta conocer el número **del negocio**. Para activarlo, configura `whatsapp.activo`, un número internacional solo con dígitos y un texto genérico. Nunca incorpores datos del visitante a ese enlace. Elegir WhatsApp como canal de respuesta solo requiere que la persona escriba su número.

Al cambiar los textos o condiciones, incrementa la versión y fecha del aviso; una página antigua debe actualizarse antes de enviar. La versión anterior permanece documentada en sus propios correos, sin aplicar cambios retroactivos.

## Preparar el correo

1. Utiliza una cuenta Cloudflare con el dominio remitente habilitado para el servicio de correo y un destino interno verificado. Comprueba en el panel las condiciones vigentes del servicio y sus límites.
2. Configura `remitente`, `destinoAvisos` y `prefijoAsunto`. El destino debe coincidir con `destination_address` del binding `AVISO_EMAIL`, tanto en producción como en `env.staging.send_email`. No aceptes un destinatario enviado por el navegador.
3. Conserva el binding `FORMULARIOS_LIMITE` y un namespace distinto para cada entorno.
4. Configura `IP_SALT` con al menos 32 caracteres aleatorios. Es necesario para el token y el hash de IP. Para el panel, usa además `ADMIN_SECRET` (al menos 32 caracteres) y `ADMIN_PASSWORD` (16 a 256).
5. Publica únicamente con autorización. Comprueba luego una consulta ficticia y revisa Gmail, spam, asunto, `Reply-To`, datos y bloque del consentimiento. No pruebes con datos de clientes.

Cloudflare realiza el envío; Gmail es el buzón, no se usa SMTP de Gmail ni contraseña de aplicación. La configuración de código no demuestra que el remitente esté autorizado o que el destino haya recibido el mensaje.

Referencias:

- [Envío desde Workers](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Restricciones de bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Límites del servicio](https://developers.cloudflare.com/email-service/platform/limits/)
- [Rate limiting de Workers](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)

## Desarrollo y validación

Requiere Node.js 22 o superior (recomendado 24 LTS) y pnpm 9.15.9 del manifiesto. Mantén el lockfile y la configuración hoisted.

Desde la raíz, copia [.dev.vars.example](../../../.dev.vars.example) a `.dev.vars` **solo si no existe**, y completa valores locales exclusivos:

```dotenv
NEXTJS_ENV=development
IP_SALT=<aleatorio de al menos 32 caracteres>
ADMIN_SECRET=<otro aleatorio de al menos 32 caracteres>
ADMIN_PASSWORD=<contraseña de entre 16 y 256 caracteres>
```

No publiques esos valores ni sobrescribas credenciales existentes. Los archivos `.dev.vars*` están ignorados salvo la plantilla. Nunca reutilices secretos de producción.

```sh
npm run db:migrate:local
npm run dev
npm run test:formularios
npm run test:frontend
npm run test:proteccion
npm run check
```

La migración local es para el panel y sus contadores, no para guardar consultas. Los tests usan entrega falsa y D1 emulada aislada; comprueban validación, tiempos, límites, espera del envío, errores sin datos personales, consentimiento, destinatario/Reply-To, HTML y autenticación. No envían correos reales ni consultan bases remotas.

El runtime local de Cloudflare tampoco demuestra entrega en Gmail. Utiliza datos ficticios; no existe un adaptador que imprima el contenido como simulación ni un reemplazo exitoso si faltan bindings.

Para validar el paquete Worker:

```sh
npx opennextjs-cloudflare build
npx opennextjs-cloudflare preview --port 3108
```

Con el preview disponible, `TEST_BASE_URL=http://localhost:3108 npm run test:runtime` valida HTTP (en PowerShell: `$env:TEST_BASE_URL='http://localhost:3108'; npm.cmd run test:runtime`). Las pruebas del navegador deben interceptar el envío para comprobar éxito/fallo sin entregar correo.

## Borrado en Gmail

El plazo vigente es **máximo seis meses desde el envío**, no desde la última respuesta. El correo muestra la fecha límite exacta; el sitio no ejecuta borrado automático en Gmail.

1. Crea un filtro por el prefijo del asunto, por ejemplo `subject:"[Consulta DannoTech]"`, y aplica la etiqueta **Consultas**. Comprueba que incluye una consulta ficticia. Si cambia el prefijo, adapta el filtro.
2. Revisa mensualmente esa etiqueta y elimina consultas que no avanzaron. La búsqueda `label:Consultas -label:Clientes older_than:6m` sirve para detectar atrasos, **no para cumplir por sí sola el máximo**. Revisa también `label:Consultas -label:Clientes older_than:5m` y elimina anticipadamente las que vencerán antes de la próxima revisión, o programa un recordatorio por cada fecha límite. Si cambias los meses configurados, ajusta las búsquedas y el calendario.
3. Cuando una consulta se convierta en cliente, aplica **Clientes** y retira **Consultas**; la exclusión de Clientes en las búsquedas evita borrar un hilo que conserve ambas etiquetas. Conserva únicamente lo necesario durante la relación y los plazos legales aplicables.
4. Ante una solicitud de eliminación, busca en **todos** los mensajes por correo, teléfono y nombre, revisa variantes del número, respuestas enviadas, adjuntos, copias, spam y papelera. Las consultas de solo teléfono no tienen correo del visitante para buscar. Verifica qué datos corresponde eliminar y atiende la solicitud sin esperar la revisión mensual.
5. Elimina las copias pertinentes y vacía también la papelera; considera respaldos y la retención del proveedor. Reaplica las eliminaciones si restauras una copia. Evita exportaciones innecesarias.
6. Mantén verificación en dos pasos, acceso restringido y revisión de seguridad en la cuenta receptora.

Una etiqueta no es una copia independiente: revisa los hilos completos y sus respuestas antes de borrar. La eliminación puede estar sujeta a obligaciones legales justificadas; no prometas borrar datos cuya conservación sea obligatoria sin revisión.

## Panel e históricos

`/admin/acceso/` autentica y redirige a `/admin/`, reservado para otras herramientas. Se retiraron `/admin/solicitudes/`, sus detalles y los endpoints de lectura/reenvío. Las consultas se revisan directamente en correo.

Se mantienen D1, esquema y migraciones para no destruir históricos y para limitar el acceso administrativo a cinco intentos por IP cada diez minutos. No hay código de inserción de consultas nuevas. Esta actualización **no elimina** registros anteriores, correos antiguos ni respaldos; su revisión y borrado requieren una decisión expresa y el aviso aplicable a cada registro.

La sesión dura ocho horas, está firmada con HMAC-SHA256 y usa cookie `HttpOnly`, `SameSite=Strict`, `Secure` fuera de desarrollo. Cada página y endpoint privado valida autenticación antes de acceder a datos; los POST comprueban origen. Conserva estas guardas al agregar herramientas. Rotar `ADMIN_SECRET` invalida sesiones; rotar `IP_SALT` invalida tokens públicos y cambia las claves de límites.

Producción usa `dannotech`/`dannotech-db`; ensayo usa `dannotech-ensayo`/`dannotech-ensayo-db`, con bindings y secretos independientes. No recrees bases ni apliques migraciones destructivas. Un respaldo histórico debe quedar cifrado/restringido fuera de Git y del repositorio. Revisa [Time Travel de D1](https://developers.cloudflare.com/d1/reference/time-travel/) y restaura primero en una base aislada.

Antes de una publicación autorizada, configura secretos con `npx wrangler secret put IP_SALT`, `ADMIN_SECRET` y `ADMIN_PASSWORD`; añade `--env staging` si corresponde a ensayo. `npm run deploy:staging` publica ensayo; `npm run deploy` publica producción. El push a la rama conectada puede activar Workers Builds; GitHub CI solo valida.

Estos textos y controles son una base de buenas prácticas, no una certificación legal. Solicita revisión jurídica del aviso y del procedimiento, especialmente respecto de la Ley 21.719, antes de abrir el servicio a clientes.
