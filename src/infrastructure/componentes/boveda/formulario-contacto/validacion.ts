import type {ConsultaContacto, ErroresContacto, FormularioContactoProps} from './tipos';

export const limitesContacto = {nombre: 100, correo: 254, mensaje: 2000};

export function validarConsulta(
  consulta: ConsultaContacto,
  {campos, textos}: Pick<FormularioContactoProps, 'campos' | 'textos'>,
): ErroresContacto {
  const errores: ErroresContacto = {};
  if (!consulta.nombre.trim()) errores.nombre = campos.nombre.error;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consulta.correo.trim())) {
    errores.correo = campos.correo.error;
  }
  if (consulta.mensaje.trim().length < 10) errores.mensaje = campos.mensaje.error;
  for (const campo of ['nombre', 'correo', 'mensaje'] as const) {
    if (consulta[campo].length > limitesContacto[campo]) errores[campo] = textos.limite;
  }
  return errores;
}
