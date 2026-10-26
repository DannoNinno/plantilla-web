import 'server-only';
import type {ConfiguracionFormularios, Notificador, Solicitud} from '../core/tipos';
import {avisoSolicitud} from '../plantillas/avisoSolicitud';

export class ConsolaNotificador implements Notificador {
  constructor(private readonly config: ConfiguracionFormularios) {}

  /** Simula el aviso exclusivamente en desarrollo; no envía correo real. */
  async enviarAviso(solicitud: Solicitud): Promise<void> {
    console.info('[AVISO SIMULADO: solo desarrollo]', avisoSolicitud(solicitud, this.config).text);
  }
}
