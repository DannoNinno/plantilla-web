import {negocio} from '../../ejemplos';
import type {CatalogoSinCompraProps} from './tipos';
export const ejemploCatalogo = {
  ...negocio.catalogo,
  productos: negocio.productos,
} satisfies CatalogoSinCompraProps;
