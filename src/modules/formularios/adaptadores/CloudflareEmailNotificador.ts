import 'server-only';
import type {ConfiguracionEnvio} from '../../../config/formularios.config';
import type {ConsultaRecibida} from '../../../domain/types/consulta';
import type {EntregaConsulta} from '../core/FormularioService';
import {avisoSolicitud} from '../plantillas/avisoSolicitud';

export class CloudflareEmailNotificador implements EntregaConsulta {
  constructor(
    private readonly binding: SendEmail | undefined,
    private readonly config: ConfiguracionEnvio,
  ) {}

  async enviarAviso(consulta: ConsultaRecibida): Promise<void> {
    if (!this.binding) throw new Error('Falta el binding AVISO_EMAIL.');
    const plan =
      this.config.consulta.planes.find((opcion) => opcion.id === consulta.plan)?.nombre ??
      'Aún no lo sé';
    await this.binding.send({
      from: {email: this.config.remitente, name: this.config.consulta.negocio},
      to: this.config.destinoAvisos,
      ...(consulta.correo ? {replyTo: consulta.correo} : {}),
      subject: `${this.config.prefijoAsunto} ${plan} — ${consulta.nombre}`,
      ...avisoSolicitud(consulta, this.config),
    });
  }
}
