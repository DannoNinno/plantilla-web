import type {ConfiguracionEnvio} from '../../../config/formularios.config';
import type {ConsultaRecibida, ResultadoConsulta} from '../../../domain/types/consulta';
import {fechaBorrado} from '../../../domain/servicios/consulta';
import {esTrampa, hashIp} from './antiSpam';
import {verificarToken} from './tokenConsulta';

export interface EntregaConsulta {
  enviarAviso(consulta: ConsultaRecibida): Promise<void>;
}
export interface LimiteConsultas {
  limit(opciones: {key: string}): Promise<{success: boolean}>;
}

export class FormularioService {
  constructor(
    private readonly notificador: EntregaConsulta,
    private readonly limite: LimiteConsultas,
    private readonly config: ConfiguracionEnvio,
    private readonly sal: string,
  ) {}

  async procesar(datos: unknown, ip: string): Promise<ResultadoConsulta> {
    if (esTrampa(datos)) return {ok: true};
    const validado = this.config.campos.safeParse(datos);
    if (!validado.success) {
      const errores: Record<string, string> = {};
      for (const problema of validado.error.issues)
        errores[String(problema.path[0] ?? 'formulario')] ??= problema.message;
      return {ok: false, mensaje: 'Revisa los campos indicados.', errores};
    }
    const token =
      typeof datos === 'object' && datos !== null && 'token' in datos ? datos.token : undefined;
    if (!(await verificarToken(token, this.sal, this.config.antiSpam)))
      return {
        ok: false,
        mensaje: 'Espera unos segundos antes de enviar. Si dejaste la página abierta, actualízala.',
      };
    if (!ip) throw new Error('No se pudo determinar la IP para limitar abusos.');
    if (!(await this.limite.limit({key: await hashIp(ip, this.sal)})).success)
      return {
        ok: false,
        mensaje: 'Has enviado varias consultas. Espera un minuto antes de volver a intentar.',
      };
    const fecha = new Date();
    try {
      await this.notificador.enviarAviso({
        ...validado.data,
        recibidoEn: fecha.toISOString(),
        borrarAntesDe: fechaBorrado(fecha, this.config.consulta.mesesConservacion),
      });
    } catch {
      console.error('consulta fallida: proveedor de correo');
      return {
        ok: false,
        mensaje: `No pude enviar tu consulta. Inténtalo de nuevo o escríbeme a ${this.config.consulta.correoContacto}.`,
      };
    }
    console.info('consulta enviada');
    return {ok: true};
  }
}
