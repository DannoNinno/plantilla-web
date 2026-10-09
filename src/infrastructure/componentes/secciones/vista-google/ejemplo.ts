import {negocio} from '../../../../demo/negocio';
import type {VistaGoogleProps} from './tipos';
export const ejemploGoogle = {
  ...negocio.google,
  titulo: negocio.nombre,
  descripcion: negocio.descripcion,
} satisfies VistaGoogleProps;
