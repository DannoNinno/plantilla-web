import type {
  CampoContactoProps,
  ConsultaContacto,
  NombreCampoContacto,
  TextosConsulta,
} from '../../base/consulta/tipos';
export type {
  CampoContactoProps,
  ConsultaContacto,
  ErroresContacto,
  NombreCampoContacto,
} from '../../base/consulta/tipos';

export interface FormularioContactoProps {
  campos: Record<NombreCampoContacto, CampoContactoProps>;
  textos: TextosConsulta;
  id?: string;
  titulo?: string;
  descripcion?: string;
  nivelTitulo?: 'h1' | 'h2';
  onConsulta?: (consulta: ConsultaContacto) => void;
}
