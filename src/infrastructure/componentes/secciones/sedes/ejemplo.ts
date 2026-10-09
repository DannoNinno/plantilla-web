import {negocio} from '../../../../demo/negocio';
import type {SedesProps} from './tipos';
export const ejemploSedes = {...negocio.seccionSedes, sedes: negocio.sedes} satisfies SedesProps;
