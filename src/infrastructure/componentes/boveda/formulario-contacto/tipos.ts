export interface ConsultaContacto {
  nombre: string;
  correo: string;
  mensaje: string;
}

export type NombreCampoContacto = keyof ConsultaContacto;
export type ErroresContacto = Partial<Record<NombreCampoContacto, string>>;

export interface CampoContactoProps {
  etiqueta: string;
  error: string;
  placeholder?: string;
}

export interface FormularioContactoProps {
  campos: Record<NombreCampoContacto, CampoContactoProps>;
  textos: {
    enviar: string;
    aviso: string;
    exito: string;
    reiniciar: string;
    errorGeneral: string;
    limite: string;
    sinJavascript: string;
  };
  id?: string;
  titulo?: string;
  descripcion?: string;
  nivelTitulo?: 'h1' | 'h2';
  onConsulta?: (consulta: ConsultaContacto) => void;
}
