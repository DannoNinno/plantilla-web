import {negocio} from '../../boveda/ejemplos';
import type {PiePaginaProps} from './tipos';
export const ejemploPiePagina = {nombre: negocio.nombre, ...negocio.pie} satisfies PiePaginaProps;
