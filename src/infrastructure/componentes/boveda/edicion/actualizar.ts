import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
import {esImagen, esRegistro, obtenerCampos} from './campos';
export type ValorEditable = string | number | ImagenContenidoDatos;
export function actualizarContenido<Props extends object>(
  props: Props,
  ruta: readonly string[],
  valor: ValorEditable,
): Props {
  const campo = obtenerCampos(props).find(
    (item) =>
      item.ruta.length === ruta.length &&
      item.ruta.every((clave, indice) => clave === ruta[indice]),
  );
  if (!campo || !ruta.length) throw new Error('Campo no editable.');
  if (
    (campo.tipo === 'texto' && typeof valor !== 'string') ||
    (campo.tipo === 'numero' &&
      (typeof valor !== 'number' || !Number.isSafeInteger(valor) || valor < 0)) ||
    (campo.tipo === 'imagen' && !esImagen(valor))
  )
    throw new Error('Valor incompatible con el campo.');
  const siguiente = structuredClone(props);
  let contenedor: unknown = siguiente;
  for (const clave of ruta.slice(0, -1)) {
    if (
      Array.isArray(contenedor) &&
      /^(0|[1-9]\d*)$/.test(clave) &&
      Object.hasOwn(contenedor, clave)
    )
      contenedor = contenedor[Number(clave)];
    else if (esRegistro(contenedor) && Object.hasOwn(contenedor, clave))
      contenedor = contenedor[clave];
    else throw new Error('Ruta de edición no disponible.');
  }
  const clave = ruta[ruta.length - 1];
  if (Array.isArray(contenedor) && /^(0|[1-9]\d*)$/.test(clave) && Object.hasOwn(contenedor, clave))
    contenedor[Number(clave)] = structuredClone(valor);
  else if (esRegistro(contenedor) && Object.hasOwn(contenedor, clave))
    contenedor[clave] = structuredClone(valor);
  else throw new Error('Destino de edición no disponible.');
  return siguiente;
}
