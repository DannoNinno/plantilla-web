import {CONTACT_EMAIL, MAX_MESSAGE_WORDS, QUOTES_EMAIL} from '../configuracion/contacto';
import type {Paquete} from '../types/paquete';

export interface DatosContacto {
  nombre: string;
  correo: string;
  paqueteId: string;
  mensaje: string;
}

type CorreoOficial = typeof CONTACT_EMAIL | typeof QUOTES_EMAIL;

export function enlaceCorreo(destinatario: CorreoOficial, asunto?: string, cuerpo?: string) {
  const parametros = [
    asunto ? `subject=${encodeURIComponent(asunto)}` : '',
    cuerpo ? `body=${encodeURIComponent(cuerpo)}` : '',
  ].filter(Boolean);
  return `mailto:${destinatario}${parametros.length ? `?${parametros.join('&')}` : ''}`;
}

export function enlaceCotizacion(paquete?: string) {
  return enlaceCorreo(
    QUOTES_EMAIL,
    paquete ? `Solicitud de cotización: ${paquete}` : 'Solicitud de cotización',
  );
}

export function contarPalabras(mensaje: string): number {
  const texto = mensaje.trim();
  return texto ? texto.split(/\s+/u).length : 0;
}

export function validarMensaje(mensaje: string): string | null {
  if (!mensaje.trim()) return 'Escribe un mensaje.';
  if (contarPalabras(mensaje) > MAX_MESSAGE_WORDS) {
    return `Tu mensaje no puede superar las ${MAX_MESSAGE_WORDS} palabras.`;
  }
  if (mensaje.trim().length < 10) return 'Escribe un mensaje de al menos 10 caracteres.';
  return null;
}

export function prepararCorreoContacto(
  datos: DatosContacto,
  paquetes: Pick<Paquete, 'id' | 'nombre'>[],
  resumen?: string,
): {ok: true; href: string} | {ok: false; error: string} {
  const nombre = datos.nombre.trim();
  const correo = datos.correo.trim();
  if (!nombre || nombre.length > 100) {
    return {ok: false, error: 'Ingresa tu nombre, con un máximo de 100 caracteres.'};
  }
  if (correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(correo)) {
    return {ok: false, error: 'Ingresa un correo válido para poder responderte.'};
  }
  const errorMensaje = validarMensaje(datos.mensaje);
  if (errorMensaje) return {ok: false, error: errorMensaje};
  const paquete = paquetes.find((opcion) => opcion.id === datos.paqueteId);
  if (datos.paqueteId !== 'consulta' && !paquete) {
    return {ok: false, error: 'Elige Consulta o uno de los planes disponibles.'};
  }
  const asunto = paquete ? `Solicitud de cotización: ${paquete.nombre}` : 'Consulta general';
  const cuerpo = [
    `Nombre: ${nombre}`,
    `Correo de contacto: ${correo}`,
    `Motivo: ${paquete?.nombre ?? 'Consulta'}`,
    '',
    datos.mensaje.trim(),
    ...(resumen ? ['', `Selección del configurador:\n${resumen}`] : []),
  ].join('\r\n');
  return {
    ok: true,
    href: enlaceCorreo(paquete ? QUOTES_EMAIL : CONTACT_EMAIL, asunto, cuerpo),
  };
}

export function mensajeSeleccion(paquete: string, componentes: string[]) {
  return [
    `Hola, me interesa cotizar el paquete ${paquete}.`,
    componentes.length > 0
      ? `Componentes seleccionados: ${componentes.join(', ')}.`
      : 'Aún no he seleccionado componentes adicionales.',
    'Me gustaría conversar sobre lo que necesita mi negocio.',
  ].join('\n');
}
