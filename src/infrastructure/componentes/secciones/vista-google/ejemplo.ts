import {negocio} from '../../boveda/ejemplos';
import type {VistaGoogleProps} from './tipos';
export const ejemploGoogle = {
  ...negocio.google,
  titulo: negocio.nombre,
  descripcion: negocio.descripcion,
} satisfies VistaGoogleProps;
