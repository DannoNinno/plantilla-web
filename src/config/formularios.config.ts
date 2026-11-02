import {consultaConfig} from '../domain/configuracion/consulta';
import {crearEsquemaConsulta} from '../domain/servicios/consulta';

export const formulariosConfig = {
  consulta: consultaConfig,
  remitente: 'formularios@dannotech.cl',
  destinoAvisos: 'daniel.progra.dannotech@gmail.com',
  prefijoAsunto: '[Consulta DannoTech]',
  zonaHoraria: 'America/Santiago',
  antiSpam: {minimoSegundos: 3, maximoSegundos: 7200},
  campos: crearEsquemaConsulta(consultaConfig),
};

export type ConfiguracionEnvio = typeof formulariosConfig;
