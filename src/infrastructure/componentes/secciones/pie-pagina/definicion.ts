import {PiePagina, type PiePaginaProps} from './index';
import {ejemploPiePagina} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionPie: DefinicionRegistro<PiePaginaProps> = {
  slug: 'pie-pagina',
  nombre: 'Pie de página',
  descripcionCorta: 'Cierre del negocio con identidad y enlace opcional al inicio.',
  planMinimo: 'presencia',
  cuentaParaTope: false,
  categoria: 'seccion',
  enDemo: true,
  componente: PiePagina,
  propsEjemplo: ejemploPiePagina,
  props: [
    {nombre: 'nombre', tipo: 'string', requerida: true, descripcion: 'Nombre del negocio.'},
    {
      nombre: 'copyright',
      tipo: 'string',
      requerida: true,
      descripcion: 'Texto final proporcionado por el proyecto destino.',
    },
  ],
};
