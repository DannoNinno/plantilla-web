import {FormularioContacto, type FormularioContactoProps} from './index';
import {ejemploFormularioContacto} from './ejemplo';
import {propsFormularioContacto} from './props';
import type {DefinicionRegistro} from '../registrar';

export const definicionFormulario: DefinicionRegistro<FormularioContactoProps> = {
  slug: 'formulario-contacto',
  nombre: 'Formulario de contacto',
  descripcionCorta: 'Consulta accesible con validación y resultado local, sin enviar información.',
  planMinimo: 'presencia',
  cuentaParaTope: true,
  categoria: 'componente',
  enDemo: true,
  componente: FormularioContacto,
  propsEjemplo: ejemploFormularioContacto,
  propsAisladas: {titulo: undefined, descripcion: undefined},
  props: propsFormularioContacto,
};
