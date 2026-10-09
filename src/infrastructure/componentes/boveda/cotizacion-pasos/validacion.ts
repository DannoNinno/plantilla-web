import {validarConsulta} from '../../base/consulta/validacion';
import type {ErroresCotizacion, FormularioCotizacionProps, SolicitudCotizacion} from './tipos';
export function validarSolicitud(
  valores: SolicitudCotizacion,
  props: FormularioCotizacionProps,
): ErroresCotizacion {
  const errores: ErroresCotizacion = validarConsulta(valores, props);
  if (!props.campos.servicio.opciones.some((opcion) => opcion.id === valores.servicio))
    errores.servicio = props.campos.servicio.error;
  return errores;
}
export function erroresPaso(errores: ErroresCotizacion, paso: number): ErroresCotizacion {
  const campos =
    paso === 1
      ? (['servicio'] as const)
      : paso === 2
        ? (['mensaje'] as const)
        : (['nombre', 'correo'] as const);
  const visibles: ErroresCotizacion = {};
  for (const campo of campos) if (errores[campo]) visibles[campo] = errores[campo];
  return visibles;
}
export function pasoPrimerError(errores: ErroresCotizacion): 1 | 2 | 3 {
  return errores.servicio ? 1 : errores.mensaje ? 2 : 3;
}
