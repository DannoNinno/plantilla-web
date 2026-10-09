import {negocio} from '../../../../demo/negocio';
import type {NovedadesProps} from './tipos';
export const ejemploNovedades = {
  ...negocio.seccionNovedades,
  elementos: negocio.novedades,
} satisfies NovedadesProps;
