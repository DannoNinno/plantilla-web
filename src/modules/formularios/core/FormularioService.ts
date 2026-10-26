import {z} from 'zod';
import {esTrampa, hashIp} from './antiSpam';
import type {
  Almacen,
  ConfiguracionFormularios,
  Notificador,
  ResultadoAviso,
  ResultadoFormulario,
} from './tipos';

const esquemaTipo = z.enum(['consulta', 'cotizacion']);
const mensajeLimite =
  'Has enviado varias solicitudes. Espera diez minutos antes de volver a intentar.';

export class FormularioService {
  constructor(
    private readonly almacen: Almacen,
    private readonly notificador: Notificador,
    private readonly config: ConfiguracionFormularios,
    private readonly sal: string,
  ) {}

  /** Valida y guarda antes de intentar cualquier aviso. */
  async procesar(datos: unknown, ip: string): Promise<ResultadoFormulario> {
    if (esTrampa(datos)) return {ok: true};
    const entrada = z.object({tipo: esquemaTipo}).safeParse(datos);
    if (!entrada.success) {
      return {
        ok: false,
        mensaje: 'Elige un tipo de solicitud válido.',
        errores: {tipo: 'Tipo inválido.'},
      };
    }
    const tipo = entrada.data.tipo;
    const validado = this.config.tipos[tipo].campos.safeParse(datos);
    if (!validado.success) {
      const errores: Record<string, string> = {};
      for (const problema of validado.error.issues) {
        const campo = String(problema.path[0] ?? 'formulario');
        errores[campo] ??= problema.message;
      }
      return {ok: false, mensaje: 'Revisa los campos indicados.', errores};
    }
    let id: string;
    try {
      if (!ip) throw new Error('No se pudo determinar la IP de la solicitud.');
      const ipHash = await hashIp(ip, this.sal);
      const {maximoPorIp, ventanaMinutos} = this.config.antiSpam;
      if ((await this.almacen.contarRecientesPorIp(ipHash, ventanaMinutos)) >= maximoPorIp) {
        return {ok: false, mensaje: mensajeLimite};
      }
      const {nombre, ...resto} = validado.data;
      const campos: Record<string, string> = {};
      for (const [clave, valor] of Object.entries(resto)) {
        if (typeof valor === 'string') campos[clave] = valor;
      }
      const solicitud = await this.almacen.guardar(
        {tipo, nombre, datos: campos, ipHash},
        {desde: new Date(Date.now() - ventanaMinutos * 60000).toISOString(), maximo: maximoPorIp},
      );
      if (!solicitud) return {ok: false, mensaje: mensajeLimite};
      id = solicitud.id;
    } catch (error) {
      console.error('No se pudo guardar la solicitud.', error);
      return {
        ok: false,
        mensaje: 'No pudimos guardar tu solicitud. Intenta nuevamente en unos minutos.',
      };
    }
    await this.reenviarAviso(id);
    return {ok: true};
  }

  /** Reserva el aviso para impedir envíos simultáneos de una misma solicitud. */
  async reenviarAviso(id: string): Promise<ResultadoAviso> {
    const token = crypto.randomUUID();
    try {
      const hasta = new Date(Date.now() + 10 * 60000).toISOString();
      if (!(await this.almacen.reservarAviso(id, token, hasta))) {
        return {ok: false, motivo: 'no_disponible'};
      }
      const solicitud = await this.almacen.obtener(id);
      if (!solicitud) throw new Error('La solicitud reservada no existe.');
      let ultimoError = 'No se pudo enviar el aviso.';
      for (let intento = 0; intento < this.config.avisos.intentosInmediatos; intento++) {
        await this.almacen.registrarIntento(id, token);
        try {
          await this.notificador.enviarAviso(solicitud);
        } catch (error) {
          ultimoError = error instanceof Error ? error.message : 'Fallo de envío sin detalle.';
          console.error('Falló el aviso de la solicitud.', {
            id,
            intento: intento + 1,
            error: ultimoError,
          });
          continue;
        }
        await this.almacen.actualizarAviso(id, token, {estado: 'enviado'});
        return {ok: true};
      }
      await this.almacen.actualizarAviso(id, token, {
        estado: 'fallido',
        error: ultimoError.slice(0, 2000),
      });
      return {ok: false, motivo: 'fallido'};
    } catch (error) {
      console.error('Error de persistencia o reserva del aviso; revisar el panel.', {id, error});
      return {ok: false, motivo: 'fallido'};
    }
  }
}
