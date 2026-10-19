# Servicios

Lista de servicios con tarjetas independientes. Presencia Digital; cuenta como una sección. Componente de servidor, sin importar contenido de negocio.

| Prop        | Tipo                | Requerida | Por defecto     |
| ----------- | ------------------- | --------- | --------------- |
| id          | string              | No        | Sin ancla       |
| titulo      | string              | No        | Sin título      |
| descripcion | string              | No        | Sin descripción |
| elementos   | readonly Servicio[] | No        | []              |

Cada servicio tiene `id`, `titulo` y `descripcion` opcional. Una lista vacía no genera tarjetas; los textos largos se ajustan al ancho disponible.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts`, `base/MarcoSeccion`, `base/Contenedor` y `base/TituloSeccion`. Dependencias: React, lucide-react y Tailwind 3. Tokens: `seccion`, `fontFamily.sans` y `spacing.demo-ancla`. No requiere JavaScript cliente, CSS propio ni datos de Café Aurora.
