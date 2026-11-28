import {negocio} from '../../ejemplos';
import type {SedesProps} from './tipos';
export const ejemploSedes = {...negocio.seccionSedes, sedes: negocio.sedes} satisfies SedesProps;
