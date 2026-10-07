export function mensajeSeleccion(paquete: string, componentes: string[]) {
  return [
    `Hola, me interesa cotizar el paquete ${paquete}.`,
    componentes.length > 0
      ? `Componentes seleccionados: ${componentes.join(', ')}.`
      : 'Aún no he seleccionado componentes adicionales.',
    'Me gustaría conversar sobre lo que necesita mi negocio.',
  ].join('\n');
}

export function enlaceWhatsapp(numero: string, mensaje: string) {
  if (!numero) return null;
  if (!/^[1-9]\d{7,14}$/.test(numero)) {
    throw new Error('Configura WhatsApp con codigo de pais y solo digitos.');
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
