import {negocio} from './negocio';
export type TextosAdministracion = Omit<typeof negocio.interfaz.administracion, 'etiquetas'> & {
  etiquetas: Record<string, string>;
};
export interface MensajeDemo {
  id: number;
  nombre: string;
  correo: string;
  mensaje: string;
  origen: string;
  leido: boolean;
}
export function cambiarSeleccion(
  seleccion: readonly string[],
  slug: string,
  disponibles: readonly string[],
  limite: number,
  fijas: readonly string[],
): string[] {
  if (!disponibles.includes(slug)) throw new Error('Sección no disponible.');
  if (fijas.includes(slug)) throw new Error('Sección fija de la demo.');
  if (seleccion.includes(slug)) return seleccion.filter((item) => item !== slug);
  if (seleccion.length >= limite) throw new Error('Límite de secciones alcanzado.');
  return [...seleccion, slug];
}
export function marcarMensaje(mensajes: readonly MensajeDemo[], id: number): MensajeDemo[] {
  if (!mensajes.some((item) => item.id === id)) throw new Error('Mensaje no disponible.');
  return mensajes.map((item) => (item.id === id ? {...item, leido: true} : item));
}

export function eliminarMensaje(mensajes: readonly MensajeDemo[], id: number): MensajeDemo[] {
  if (!mensajes.some((item) => item.id === id)) throw new Error('Mensaje no disponible.');
  return mensajes.filter((item) => item.id !== id);
}
