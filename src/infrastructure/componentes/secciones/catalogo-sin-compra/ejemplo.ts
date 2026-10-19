import {negocio} from '../../boveda/ejemplos';
import type {CatalogoSinCompraProps} from './tipos';
export const ejemploCatalogo = {
  ...negocio.catalogo,
  productos: negocio.productos,
} satisfies CatalogoSinCompraProps;
