import type {ZodType} from 'zod';

export type TipoFormulario = 'consulta' | 'cotizacion';
export type EstadoAviso = 'pendiente' | 'enviado' | 'fallido';

export interface DatosFormulario {
  nombre: string;
  asunto?: string;
  mensaje?: string;
  servicio?: string;
  detalle?: string;
  telefono?: string;
}

export interface NuevaSolicitud {
  tipo: TipoFormulario;
  nombre: string;
  datos: Record<string, string>;
  ipHash: string;
}

export interface Solicitud extends NuevaSolicitud {
  id: string;
  email: string | null;
  estadoAviso: EstadoAviso;
  intentosAviso: number;
  ultimoError: string | null;
  leida: boolean;
  creadoEn: string;
  avisadoEn: string | null;
  reservaHasta: string | null;
}

export interface FiltroSolicitudes {
  tipo?: TipoFormulario;
  estado?: EstadoAviso;
  pagina?: number;
}

export interface Almacen {
  guardar(
    solicitud: NuevaSolicitud,
    limite: {desde: string; maximo: number},
  ): Promise<Solicitud | null>;
  obtener(id: string): Promise<Solicitud | null>;
  listar(filtro?: FiltroSolicitudes): Promise<Solicitud[]>;
  contar(filtro?: FiltroSolicitudes): Promise<number>;
  contarRecientesPorIp(ipHash: string, minutos: number): Promise<number>;
  marcarLeida(id: string): Promise<void>;
  reservarAviso(id: string, token: string, hasta: string): Promise<boolean>;
  registrarIntento(id: string, token: string): Promise<void>;
  actualizarAviso(
    id: string,
    token: string,
    cambio: {estado: EstadoAviso; error?: string},
  ): Promise<void>;
}

export interface Notificador {
  enviarAviso(solicitud: Solicitud): Promise<void>;
}

export interface DefinicionFormulario {
  etiqueta: string;
  campos: ZodType<DatosFormulario>;
  asunto: (datos: DatosFormulario) => string;
  destino?: string;
}

export interface ConfiguracionFormularios {
  nombreSitio: string;
  urlSitio: string;
  remitente: string;
  destinoAvisos: string;
  zonaHoraria: string;
  tipos: Record<TipoFormulario, DefinicionFormulario>;
  antiSpam: {maximoPorIp: number; ventanaMinutos: number};
  avisos: {intentosInmediatos: number};
}

export type ResultadoFormulario =
  {ok: true} | {ok: false; mensaje: string; errores?: Record<string, string>};

export type ResultadoAviso = {ok: true} | {ok: false; motivo: 'no_disponible' | 'fallido'};
