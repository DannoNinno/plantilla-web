import 'server-only';
import {obtenerEntorno} from '../entornoCloudflare';
import {formulariosConfig} from '../../config/formularios.config';
import {CloudflareEmailNotificador} from './adaptadores/CloudflareEmailNotificador';
import {FormularioService} from './core/FormularioService';

export {obtenerEntorno};

export async function crearFormularios() {
  const env = await obtenerEntorno();
  if (!env.IP_SALT || env.IP_SALT.length < 32)
    throw new Error('Configura IP_SALT (mínimo 32 caracteres).');
  if (!env.FORMULARIOS_LIMITE) throw new Error('Falta el binding FORMULARIOS_LIMITE.');
  const notificador = new CloudflareEmailNotificador(env.AVISO_EMAIL, formulariosConfig);
  return {
    servicio: new FormularioService(
      notificador,
      env.FORMULARIOS_LIMITE,
      formulariosConfig,
      env.IP_SALT,
    ),
  };
}
