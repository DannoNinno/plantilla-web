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
export interface TextosConsulta {
  enviar: string;
  aviso: string;
  exito: string;
  reiniciar: string;
  errorGeneral: string;
  limite: string;
  sinJavascript: string;
}
export interface ValidacionConsultaProps {
  campos: Record<NombreCampoContacto, CampoContactoProps>;
  textos: Pick<TextosConsulta, 'limite'>;
}
