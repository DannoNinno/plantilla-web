# Redes sociales

Navegación social adaptable, con enlaces separados en su propio subcomponente. Siempre incluida; no cuenta para el límite de secciones.

| Prop        | Tipo                    | Requerida | Por defecto |
| ----------- | ----------------------- | --------- | ----------- |
| etiqueta    | string                  | Sí        | —           |
| descripcion | string                  | No        | Sin aviso   |
| enlaces     | readonly EnlaceSocial[] | No        | []          |

Cada enlace tiene `id`, `texto` y `href`. No hay nombres de plataformas, cuentas ni destinos fijados dentro del componente. La demo dirige sus enlaces a `#contacto` y explica que no son perfiles reales.

Para copiar: incluir esta carpeta sin `ejemplo.ts` ni `definicion.ts` y `base/Contenedor`. Dependencias: React, lucide-react, Tailwind 3. Tokens: `seccion`, `brand.light`, `outlineWidth.foco`; variante `fine-pointer`. Sin JavaScript cliente, CSS propio ni conexiones externas.
