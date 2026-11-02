import {CONTACT_EMAIL, MAX_MESSAGE_WORDS, QUOTES_EMAIL} from '../configuracion/contacto';

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
