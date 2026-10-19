# Catálogo sin compra

Sección de Captación; cuenta para el límite. No incluye carrito, pago ni backend.

Props exportadas: `CatalogoSinCompraProps`. `textoConsulta` y `hrefConsulta` son obligatorios. `id`, `titulo`, `descripcion`, `productos` son opcionales; productos es una lista vacía por defecto. Cada producto tiene `id`, `nombre`, descripción/precio/imagen opcionales. Los precios se formatean como CLP, sin alterar el precio recibido. Las tarjetas viven en `TarjetaProducto.tsx`.

El cliente puede pasar un enlace real de WhatsApp. La demo usa `#contacto`: no tiene números reales y conserva un destino válido aunque se desactive la cotización por pasos.

Para copiar, excluir `ejemplo.ts` y `definicion.ts`; incluir `base/MarcoSeccion`, `base/Contenedor`, `base/TituloSeccion`, `base/ImagenContenido`, `base/Boton`, `Boton/estilos.ts` y `domain/servicios/precio.ts`. Mantener rutas relativas. Requiere React, Next Image y Tailwind 3 con tokens `brand`, `seccion`, `fontFamily.sans`, `outlineWidth.foco`, `spacing.demo-ancla` y variante `fine-pointer`.
