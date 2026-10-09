import {negocio} from '../../../../demo/negocio';
import type {UbicacionHorariosProps} from './tipos';
export const ejemploUbicacionHorarios = {
  ...negocio.sedes[0],
  ...negocio.ubicacion,
} satisfies UbicacionHorariosProps;
