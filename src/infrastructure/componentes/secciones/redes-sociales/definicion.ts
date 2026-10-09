import {RedesSociales, type RedesSocialesProps} from './index';
import {ejemploRedesSociales} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';

export const definicionRedes: DefinicionRegistro<RedesSocialesProps> = {
  slug: 'redes-sociales',
  nombre: 'Redes sociales',
  descripcionCorta: 'Navegación social sin destinos ni marcas fijados en el componente.',
  planMinimo: 'presencia',
  cuentaParaTope: false,
  categoria: 'seccion',
  enDemo: true,
  componente: RedesSociales,
  propsEjemplo: ejemploRedesSociales,
  props: [
    {
      nombre: 'etiqueta',
      tipo: 'string',
      requerida: true,
      descripcion: 'Nombre accesible de la navegación.',
    },
    {
      nombre: 'enlaces',
      tipo: 'EnlaceSocial[]',
      requerida: false,
      descripcion: 'Lista de enlaces; vacía por defecto.',
    },
  ],
};
