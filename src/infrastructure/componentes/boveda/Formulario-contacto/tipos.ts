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

export interface EnlaceSocialContacto {
  id: string;
  texto: string;
  href: string;
}

export interface RedesContactoProps {
  etiqueta: string;
  enlaces: readonly EnlaceSocialContacto[];
}

export interface FormularioContactoProps {
  campos: Record<NombreCampoContacto, CampoContactoProps>;
  textos: TextosConsulta;
  id?: string;
  titulo?: string;
  descripcion?: string;
  nivelTitulo?: 'h1' | 'h2';
  redes?: RedesContactoProps;
  onConsulta?: (consulta: ConsultaContacto) => void;
}
