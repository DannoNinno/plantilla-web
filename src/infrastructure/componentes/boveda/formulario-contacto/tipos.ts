import type {
  CampoContactoProps,
  ConsultaContacto,
  NombreCampoContacto,
  TextosConsulta,
} from '../Base/Consulta/tipos';
export type {
  CampoContactoProps,
  ConsultaContacto,
  ErroresContacto,
  NombreCampoContacto,
} from '../Base/Consulta/tipos';

export interface FormularioContactoProps {
  campos: Record<NombreCampoContacto, CampoContactoProps>;
  textos: TextosConsulta;
  id?: string;
  titulo?: string;
  descripcion?: string;
  nivelTitulo?: 'h1' | 'h2';
  onConsulta?: (consulta: ConsultaContacto) => void;
}
