import 'server-only';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {formulariosConfig} from '../../config/formularios.config';
import {D1Almacen} from './adaptadores/D1Almacen';
import {CloudflareEmailNotificador} from './adaptadores/CloudflareEmailNotificador';
import {ConsolaNotificador} from './adaptadores/ConsolaNotificador';
import {FormularioService} from './core/FormularioService';

export async function obtenerEntorno() {
  const {env} = await getCloudflareContext({async: true});
  if (!env.DB) throw new Error('Falta el binding DB.');
  return env;
}

export async function crearFormularios() {
  const env = await obtenerEntorno();
  if (!env.IP_SALT || env.IP_SALT.length < 32)
    throw new Error('Configura IP_SALT (mínimo 32 caracteres).');
  const config = {
    ...formulariosConfig,
    urlSitio: env.FORMULARIOS_URL ?? formulariosConfig.urlSitio,
  };
  const url = new URL(config.urlSitio);
  if (process.env.NODE_ENV !== 'development' && url.protocol !== 'https:') {
    throw new Error('FORMULARIOS_URL debe usar HTTPS.');
  }
  const almacen = new D1Almacen(env.DB);
  const notificador =
    process.env.NODE_ENV === 'development'
      ? new ConsolaNotificador(config)
      : new CloudflareEmailNotificador(env.AVISO_EMAIL, config);
  return {
    almacen,
    servicio: new FormularioService(almacen, notificador, config, env.IP_SALT),
  };
}
