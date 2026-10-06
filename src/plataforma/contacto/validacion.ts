export interface Consulta {
  nombre: string;
  correo: string;
  mensaje: string;
  seleccion?: {paquete: string; componentes: string[]};
}

export function validarConsulta(valor: unknown): {consulta?: Consulta; error?: string} {
  if (!valor || typeof valor !== 'object')
    return {error: 'La consulta no tiene un formato válido.'};
  const entrada = valor as Record<string, unknown>;
  const nombre = typeof entrada.nombre === 'string' ? entrada.nombre.trim() : '';
  const correo = typeof entrada.correo === 'string' ? entrada.correo.trim() : '';
  const mensaje = typeof entrada.mensaje === 'string' ? entrada.mensaje.trim() : '';
  if (!nombre || nombre.length > 100) return {error: 'Indica tu nombre (hasta 100 caracteres).'};
  if (correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    return {error: 'Indica un correo válido.'};
  if (mensaje.length < 10 || mensaje.length > 3000)
    return {error: 'El mensaje debe tener entre 10 y 3000 caracteres.'};
  let seleccion: Consulta['seleccion'];
  if (entrada.seleccion !== undefined) {
    if (!entrada.seleccion || typeof entrada.seleccion !== 'object')
      return {error: 'La selección no es válida.'};
    const opcion = entrada.seleccion as Record<string, unknown>;
    if (
      typeof opcion.paquete !== 'string' ||
      !Array.isArray(opcion.componentes) ||
      opcion.componentes.length > 100 ||
      !opcion.componentes.every(
        (id): id is string => typeof id === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(id),
      )
    )
      return {error: 'La selección no es válida.'};
    seleccion = {paquete: opcion.paquete, componentes: [...new Set(opcion.componentes)]};
  }
  return {consulta: {nombre, correo, mensaje, seleccion}};
}
