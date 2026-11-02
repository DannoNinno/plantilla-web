import {escapeHtml} from '../core/escapeHtml';
import type {ConfiguracionEnvio} from '../../../config/formularios.config';
import type {ConsultaRecibida} from '../../../domain/types/consulta';
import {avisoConsulta} from '../../../domain/servicios/avisoConsulta';

export function avisoSolicitud(consulta: ConsultaRecibida, config: ConfiguracionEnvio) {
  const fecha = (valor: string) =>
    new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: config.zonaHoraria,
    }).format(new Date(valor)) + ` (${config.zonaHoraria})`;
  const plan =
    config.consulta.planes.find((opcion) => opcion.id === consulta.plan)?.nombre ?? 'Aún no lo sé';
  const campos = [
    ['Nombre', consulta.nombre],
    ['Teléfono', consulta.telefono || 'No indicado'],
    ['Correo', consulta.correo || 'No indicado'],
    ['Canal preferido', consulta.canal],
    ['Plan de interés', plan],
    ['Mensaje', consulta.mensaje],
    ['Consentimiento', 'Aceptado: datos propios o autorizados; solo responder esta consulta'],
    ['Versión del aviso', consulta.versionAviso],
    ['Fecha de envío', fecha(consulta.recibidoEn)],
    ['Fecha límite de borrado si no avanza', fecha(consulta.borrarAntesDe)],
  ];
  const aviso = avisoConsulta(config.consulta);
  return {
    text: `${config.consulta.negocio}\n\n${campos.map(([clave, valor]) => `${clave}: ${valor}`).join('\n\n')}\n\nAviso aceptado:\n${aviso.map((punto) => `${punto.titulo}: ${punto.texto}`).join('\n\n')}`,
    html: `<h1>${escapeHtml(config.consulta.negocio)}</h1>${campos.map(([clave, valor]) => `<p><strong>${escapeHtml(clave)}:</strong><br>${escapeHtml(valor).replace(/\n/gu, '<br>')}</p>`).join('')}<h2>Aviso aceptado</h2>${aviso.map((punto) => `<p><strong>${escapeHtml(punto.titulo)}:</strong> ${escapeHtml(punto.texto)}</p>`).join('')}`,
  };
}
