import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
interface RutaEditable {
  ruta: string[];
}
export type CampoEditable = RutaEditable &
  (
    | {tipo: 'texto'; valor: string}
    | {tipo: 'numero'; valor: number}
    | {tipo: 'imagen'; valor: ImagenContenidoDatos}
  );
export function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}
export function esImagen(valor: unknown): valor is ImagenContenidoDatos {
  return (
    esRegistro(valor) &&
    typeof valor.src === 'string' &&
    typeof valor.alt === 'string' &&
    typeof valor.width === 'number' &&
    Number.isSafeInteger(valor.width) &&
    valor.width > 0 &&
    typeof valor.height === 'number' &&
    Number.isSafeInteger(valor.height) &&
    valor.height > 0
  );
}
export function obtenerCampos(valor: unknown, ruta: string[] = []): CampoEditable[] {
  if (esImagen(valor))
    return [
      {ruta, tipo: 'imagen', valor},
      {ruta: [...ruta, 'alt'], tipo: 'texto', valor: valor.alt},
    ];
  if (Array.isArray(valor))
    return valor.flatMap((item: unknown, indice) => obtenerCampos(item, [...ruta, String(indice)]));
  if (esRegistro(valor))
    return Object.entries(valor).flatMap(([clave, item]) => {
      if (
        ['id', 'nivelTitulo', '__proto__', 'constructor', 'prototype'].includes(clave) ||
        /^href/i.test(clave)
      )
        return [];
      return obtenerCampos(item, [...ruta, clave]);
    });
  if (typeof valor === 'string') return [{ruta, tipo: 'texto', valor}];
  if (typeof valor === 'number' && ruta.at(-1) === 'precio') return [{ruta, tipo: 'numero', valor}];
  return [];
}
