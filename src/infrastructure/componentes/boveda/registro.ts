import {registrar} from './registrar';
import {definicionPortada} from '../secciones/portada/definicion';
import {definicionServicios} from '../secciones/servicios/definicion';
import {definicionQuienesSomos} from '../secciones/quienes-somos/definicion';
import {definicionGaleria} from '../secciones/galeria/definicion';
import {definicionTestimonios} from '../secciones/testimonios/definicion';
import {definicionPreguntas} from '../secciones/preguntas-frecuentes/definicion';
import {definicionUbicacion} from '../secciones/ubicacion-horarios/definicion';
import {definicionFormulario} from './formulario-contacto/definicion';
import {definicionWhatsapp} from '../secciones/whatsapp/definicion';
import {definicionRedes} from '../secciones/redes-sociales/definicion';
import {definicionPie} from '../secciones/pie-pagina/definicion';
import {definicionNovedades} from '../secciones/novedades/definicion';
import {definicionCatalogo} from '../secciones/catalogo-sin-compra/definicion';
import {definicionSedes} from '../secciones/sedes/definicion';
import {definicionPromocion} from '../secciones/promocion-destacada/definicion';
import {definicionEquipo} from '../secciones/equipo/definicion';
import {definicionGoogle} from '../secciones/vista-google/definicion';
import {definicionCotizacion} from './cotizacion-pasos/definicion';

export type {PlanBoveda, DocumentacionProp} from './registrar';

export const registro = [
  registrar(definicionPortada),
  registrar(definicionServicios),
  registrar(definicionQuienesSomos),
  registrar(definicionGaleria),
  registrar(definicionTestimonios),
  registrar(definicionPreguntas),
  registrar(definicionUbicacion),
  registrar(definicionFormulario),
  registrar(definicionNovedades),
  registrar(definicionCatalogo),
  registrar(definicionCotizacion),
  registrar(definicionSedes),
  registrar(definicionPromocion),
  registrar(definicionEquipo),
  registrar(definicionGoogle),
  registrar(definicionWhatsapp),
  registrar(definicionRedes),
  registrar(definicionPie),
];

export type EntradaBoveda = (typeof registro)[number];
export const registroBoveda = registro.filter((entrada) => entrada.categoria === 'componente');

export function getComponente(slug: string) {
  return registroBoveda.find((entrada) => entrada.slug === slug);
}
