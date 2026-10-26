import 'server-only';
import type {ConfiguracionFormularios, Notificador, Solicitud} from '../core/tipos';
import {avisoSolicitud} from '../plantillas/avisoSolicitud';

export class CloudflareEmailNotificador implements Notificador {
  constructor(
    private readonly binding: SendEmail | undefined,
    private readonly config: ConfiguracionFormularios,
  ) {}

  /** Envía solo al destinatario interno configurado, sin correo del visitante. */
  async enviarAviso(solicitud: Solicitud): Promise<void> {
    if (!this.binding) throw new Error('Falta el binding AVISO_EMAIL en producción.');
    const definicion = this.config.tipos[solicitud.tipo];
    await this.binding.send({
      from: {email: this.config.remitente, name: `Formularios ${this.config.nombreSitio}`},
      to: definicion.destino ?? this.config.destinoAvisos,
      subject: definicion.asunto({
        ...solicitud.datos,
        nombre: solicitud.nombre,
      }),
      ...avisoSolicitud(solicitud, this.config),
    });
  }
}
