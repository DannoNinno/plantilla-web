import {CatalogoSinCompra, type CatalogoSinCompraProps} from './index';
import {ejemploCatalogo} from './ejemplo';
import type {DefinicionRegistro} from '../../boveda/registrar';
export const definicionCatalogo: DefinicionRegistro<CatalogoSinCompraProps> = {
  slug: 'catalogo-sin-compra',
  nombre: 'Catálogo sin compra',
  descripcionCorta: 'Productos con precios y enlaces de consulta, sin carrito.',
  planMinimo: 'captacion',
  cuentaParaTope: true,
  categoria: 'seccion',
  enDemo: true,
  componente: CatalogoSinCompra,
  propsEjemplo: ejemploCatalogo,
  props: [
    {
      nombre: 'productos',
      tipo: 'ProductoCatalogo[]',
      requerida: false,
      descripcion: 'Productos; lista vacía por defecto.',
    },
    {
      nombre: 'textoConsulta',
      tipo: 'string',
      requerida: true,
      descripcion: 'Etiqueta del enlace de consulta.',
    },
    {
      nombre: 'hrefConsulta',
      tipo: 'string',
      requerida: true,
      descripcion: 'Destino; en la demo es un ancla local.',
    },
  ],
};
