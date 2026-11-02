import {registrar} from './registrar';
import {definicionPortada} from './Secciones/Portada/definicion';
import {definicionServicios} from './Secciones/Servicios/definicion';
import {definicionQuienesSomos} from './Secciones/Quienes-somos/definicion';
import {definicionGaleria} from './Secciones/Galeria/definicion';
import {definicionTestimonios} from './Secciones/Testimonios/definicion';
import {definicionPreguntas} from './Secciones/Preguntas-frecuentes/definicion';
import {definicionUbicacion} from './Secciones/Ubicacion-horarios/definicion';
import {definicionFormulario} from './Formulario-contacto/definicion';
import {definicionWhatsapp} from './Secciones/Whatsapp/definicion';
import {definicionRedes} from './Secciones/Redes-sociales/definicion';
import {definicionPie} from './Secciones/Pie-pagina/definicion';
import {definicionNovedades} from './Secciones/Novedades/definicion';
import {definicionCatalogo} from './Secciones/Catalogo-sin-compra/definicion';
import {definicionSedes} from './Secciones/Sedes/definicion';
import {definicionPromocion} from './Secciones/Promocion-destacada/definicion';
import {definicionEquipo} from './Secciones/Equipo/definicion';
import {definicionGoogle} from './Secciones/Vista-google/definicion';
import {definicionCotizacion} from './Cotizacion-pasos/definicion';

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
