import {escapeHtml} from '../core/escapeHtml';
import type {ConfiguracionFormularios, Solicitud} from '../core/tipos';

export function avisoSolicitud(s: Solicitud, config: ConfiguracionFormularios) {
  const fecha = new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: config.zonaHoraria,
  }).format(new Date(s.creadoEn));
  const enlace = new URL(`/admin/solicitudes/${encodeURIComponent(s.id)}/`, config.urlSitio).href;
  const campos = [
    ['Solicitud', s.id],
    ['Tipo', config.tipos[s.tipo].etiqueta],
    ['Nombre', s.nombre],
    ...Object.entries(s.datos),
    ['Fecha', `${fecha} (${config.zonaHoraria})`],
  ];
  return {
    text: `${config.nombreSitio}\n\n${campos.map(([clave, valor]) => `${clave}: ${valor}`).join('\n\n')}\n\nVer solicitud: ${enlace}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h1>${escapeHtml(config.nombreSitio)}</h1>${campos.map(([clave, valor]) => `<p><strong>${escapeHtml(clave)}:</strong><br><span style="white-space:pre-wrap">${escapeHtml(valor)}</span></p>`).join('')}<p><a href="${escapeHtml(enlace)}">Ver solicitud en el panel</a></p></div>`,
  };
}
