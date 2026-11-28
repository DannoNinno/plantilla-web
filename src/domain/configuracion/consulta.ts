import paquetes from '../../data/paquetes.json';
import {CONTACT_EMAIL, PRIVACY_VERSION} from './contacto';
import type {ConfiguracionConsulta} from '../types/consulta';

export const consultaConfig: ConfiguracionConsulta = {
  negocio: 'DannoTech',
  responsable: 'Daniel Salamanca Jorquera',
  correoContacto: CONTACT_EMAIL,
  mesesConservacion: 6,
  plazoRespuesta: '24 horas hábiles',
  proveedores: 'Cloudflare y Google (Gmail)',
  proveedoresFueraDeChile: true,
  aviso: {version: PRIVACY_VERSION, fecha: '28 de noviembre de 2026'},
  planes: paquetes.filter((plan) => plan.habilitado).map(({id, nombre}) => ({id, nombre})),
  whatsapp: {activo: false, numero: '', mensaje: 'Hola, quisiera hacer una consulta.'},
};
