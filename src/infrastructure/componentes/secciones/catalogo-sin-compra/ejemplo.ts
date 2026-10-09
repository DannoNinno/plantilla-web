import {negocio} from '../../../../demo/negocio';
import type {CatalogoSinCompraProps} from './tipos';
export const ejemploCatalogo = {
  ...negocio.catalogo,
  productos: negocio.productos,
} satisfies CatalogoSinCompraProps;
