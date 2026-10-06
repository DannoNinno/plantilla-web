import type {DefinicionComponente} from './tipos';

export function validarRegistro(definiciones: DefinicionComponente[]) {
  const ids = new Set<string>();
  for (const definicion of definiciones) {
    if (!/^[a-z][a-z0-9-]*$/.test(definicion.id) || ids.has(definicion.id)) {
      throw new Error(`Identificador de componente invalido o duplicado: ${definicion.id}`);
    }
    ids.add(definicion.id);
  }
}

export function resolverSeleccion(
  definiciones: DefinicionComponente[],
  paquete: string,
  elegidos: string[],
): {ids: string[]; errores: string[]} {
  const disponibles = definiciones.filter((item) => item.paquetes[paquete]);
  const porId = new Map(disponibles.map((item) => [item.id, item]));
  const ids = new Set<string>();
  const errores = new Set<string>();
  const visitando = new Set<string>();
  const invalidos = new Set<string>();

  function incluir(id: string): boolean {
    if (visitando.has(id)) {
      errores.add(`Dependencia circular en ${id}.`);
      invalidos.add(id);
      return false;
    }
    if (ids.has(id)) return true;
    if (invalidos.has(id)) return false;
    const componente = porId.get(id);
    if (!componente) {
      errores.add(`El componente ${id} no está disponible en este paquete.`);
      invalidos.add(id);
      return false;
    }
    visitando.add(id);
    let valido = true;
    for (const dependencia of componente.dependencias) {
      if (!incluir(dependencia)) valido = false;
    }
    visitando.delete(id);
    if (!valido || invalidos.has(id)) {
      invalidos.add(id);
      return false;
    }
    ids.add(id);
    return true;
  }

  for (const id of elegidos) incluir(id);
  return {
    ids: disponibles.filter((item) => ids.has(item.id)).map((item) => item.id),
    errores: [...errores],
  };
}

export function seleccionInicial(definiciones: DefinicionComponente[], paquete: string) {
  return resolverSeleccion(
    definiciones,
    paquete,
    definiciones.filter((item) => item.paquetes[paquete] === 'base').map((item) => item.id),
  );
}

export function resolverConfiguracionSitio(
  definiciones: DefinicionComponente[],
  paquete: string,
  configuracion: Record<string, boolean>,
) {
  const elegidos = Object.entries(configuracion)
    .filter(([, activo]) => activo)
    .map(([id]) => id);
  return resolverSeleccion(
    definiciones.filter((item) => configuracion[item.id] === true),
    paquete,
    elegidos,
  );
}
