import type {
  CampoContactoProps,
  ConsultaContacto,
  NombreCampoContacto,
  TextosConsulta,
} from '../../base/consulta/tipos';
export interface SolicitudCotizacion extends ConsultaContacto {
  servicio: string;
}
export type ErroresCotizacion = Partial<Record<keyof SolicitudCotizacion, string>>;
export interface ServicioCotizacion {
  id: string;
  texto: string;
}
export interface FormularioCotizacionProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  campos: Record<NombreCampoContacto, CampoContactoProps> & {
    servicio: CampoContactoProps & {opciones: readonly ServicioCotizacion[]};
  };
  textos: TextosConsulta & {
    siguiente: string;
    anterior: string;
    paso: string;
    pasos: readonly string[];
  };
  onConsulta?: (consulta: ConsultaContacto) => void;
}
