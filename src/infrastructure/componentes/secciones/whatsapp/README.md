# WhatsApp

Enlace flotante con destino configurable. Siempre incluido en ambos planes; no cuenta para el límite de secciones.

| Prop  | Tipo   | Requerida |
| ----- | ------ | --------- |
| texto | string | Sí        |
| href  | string | Sí        |

El texto define el nombre accesible y el tooltip. En un proyecto cliente `href` puede apuntar al canal que el cliente autorice. En esta demo apunta a `#contacto`: no hay un número real, conversación externa ni envío. El nombre accesible avisa que es una demostración.

La posición deja espacio para la botonera de la demo (`bottom-28`). Un hover breve y el foco visible respetan movimiento reducido. No necesita JavaScript.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`. Dependencias: React, lucide-react, Tailwind 3. Tokens: `canal.whatsapp`, `brand`, `outlineWidth.foco`; variante `fine-pointer`. El componente no importa otra sección ni datos del negocio.
