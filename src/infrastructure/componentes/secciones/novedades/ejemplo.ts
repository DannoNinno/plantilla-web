import {negocio} from '../../boveda/ejemplos';
import type {NovedadesProps} from './tipos';
export const ejemploNovedades = {
  ...negocio.seccionNovedades,
  elementos: negocio.novedades,
} satisfies NovedadesProps;
