export type CanalContacto = 'whatsapp' | 'llamada' | 'correo';

export interface ConfiguracionConsulta {
  negocio: string;
  responsable: string;
  correoContacto: string;
  mesesConservacion: number;
  plazoRespuesta: string;
  proveedores: string;
  proveedoresFueraDeChile: boolean;
  aviso: {version: string; fecha: string};
  planes: readonly {id: string; nombre: string}[];
  whatsapp: {activo: boolean; numero: string; mensaje: string};
}

export interface DatosConsulta {
  nombre: string;
  telefono: string;
  correo: string;
  canal: CanalContacto;
  plan: string;
  mensaje: string;
  consentimiento: true;
  versionAviso: string;
}

export interface ConsultaRecibida extends DatosConsulta {
  recibidoEn: string;
  borrarAntesDe: string;
}

export type ResultadoConsulta =
  {ok: true} | {ok: false; mensaje: string; errores?: Record<string, string>};
