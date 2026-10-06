import 'server-only';
import {getDb} from './sqlite';
import {validarConsulta, type Consulta} from '../contacto/validacion';

export function guardarConsulta(consulta: Consulta) {
  return getDb()
    .prepare(
      `
    INSERT INTO consultas (nombre, correo, mensaje, seleccion, fecha) VALUES (?, ?, ?, ?, ?)
  `,
    )
    .run(
      consulta.nombre,
      consulta.correo,
      consulta.mensaje,
      consulta.seleccion ? JSON.stringify(consulta.seleccion) : null,
      new Date().toISOString(),
    ).lastInsertRowid;
}

export function getConsultas() {
  type ConsultaFila = {
    id: number;
    nombre: string;
    correo: string;
    mensaje: string;
    seleccion: string | null;
    fecha: string;
  };
  const filas = getDb()
    .prepare<[], ConsultaFila>('SELECT * FROM consultas ORDER BY id DESC LIMIT 100')
    .all();
  return filas.map((fila) => {
    const seleccion: unknown = fila.seleccion ? JSON.parse(fila.seleccion) : undefined;
    const resultado = validarConsulta({...fila, seleccion});
    if (!resultado.consulta) {
      throw new Error(`La consulta ${fila.id} contiene datos inválidos: ${resultado.error}`);
    }
    return {...fila, seleccion: resultado.consulta.seleccion};
  });
}
