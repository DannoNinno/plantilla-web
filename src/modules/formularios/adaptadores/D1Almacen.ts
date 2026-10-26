import 'server-only';
import {and, count, desc, eq, gte, sql} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/d1';
import {solicitudes, intentosAcceso} from '../db/esquema';
import type {
  Almacen,
  FiltroSolicitudes,
  NuevaSolicitud,
  Solicitud,
  EstadoAviso,
} from '../core/tipos';

export const TAMANO_PAGINA = 20;

export class D1Almacen implements Almacen {
  private readonly db;

  constructor(binding: D1Database) {
    this.db = drizzle(binding);
  }

  /** Inserta con comprobación atómica del límite para evitar carreras. */
  async guardar(
    s: NuevaSolicitud,
    limite: {desde: string; maximo: number},
  ): Promise<Solicitud | null> {
    const id = crypto.randomUUID();
    const resultado = await this.db.run(sql`
      INSERT INTO solicitudes (id, tipo, nombre, datos, ip_hash, creado_en)
      SELECT ${id}, ${s.tipo}, ${s.nombre}, ${JSON.stringify(s.datos)}, ${s.ipHash}, ${new Date().toISOString()}
      WHERE (SELECT COUNT(*) FROM solicitudes WHERE ip_hash = ${s.ipHash}
        AND creado_en >= ${limite.desde}) < ${limite.maximo}
    `);
    if (!resultado.meta.changes) return null;
    const solicitud = await this.obtener(id);
    if (!solicitud) throw new Error('No se pudo recuperar la solicitud guardada.');
    return solicitud;
  }

  /** Obtiene la solicitud completa, incluidos los errores de aviso. */
  async obtener(id: string): Promise<Solicitud | null> {
    const [fila] = await this.db.select().from(solicitudes).where(eq(solicitudes.id, id)).limit(1);
    return fila ?? null;
  }

  private filtro(filtro: FiltroSolicitudes) {
    return and(
      filtro.tipo ? eq(solicitudes.tipo, filtro.tipo) : undefined,
      filtro.estado ? eq(solicitudes.estadoAviso, filtro.estado) : undefined,
    );
  }

  /** Lista páginas de tamaño fijo, desde la solicitud más reciente. */
  async listar(filtro: FiltroSolicitudes = {}): Promise<Solicitud[]> {
    return this.db
      .select()
      .from(solicitudes)
      .where(this.filtro(filtro))
      .orderBy(desc(solicitudes.creadoEn), desc(solicitudes.id))
      .limit(TAMANO_PAGINA)
      .offset(((filtro.pagina ?? 1) - 1) * TAMANO_PAGINA);
  }

  /** Cuenta las solicitudes de un filtro, independientemente de la página. */
  async contar(filtro: FiltroSolicitudes = {}): Promise<number> {
    const [fila] = await this.db
      .select({total: count()})
      .from(solicitudes)
      .where(this.filtro(filtro));
    return fila.total;
  }

  /** Cuenta solicitudes recientes sin almacenar IP en claro. */
  async contarRecientesPorIp(ipHash: string, minutos: number): Promise<number> {
    const [fila] = await this.db
      .select({total: count()})
      .from(solicitudes)
      .where(
        and(
          eq(solicitudes.ipHash, ipHash),
          gte(solicitudes.creadoEn, new Date(Date.now() - minutos * 60000).toISOString()),
        ),
      );
    return fila.total;
  }

  /** Marca como leída sin modificar el estado del aviso. */
  async marcarLeida(id: string): Promise<void> {
    await this.db.update(solicitudes).set({leida: true}).where(eq(solicitudes.id, id));
  }

  /** Reserva exclusivamente un aviso pendiente o fallido; recupera reservas vencidas. */
  async reservarAviso(id: string, token: string, hasta: string): Promise<boolean> {
    const resultado = await this.db.run(sql`
      UPDATE solicitudes SET reserva_token = ${token}, reserva_hasta = ${hasta}
      WHERE id = ${id} AND estado_aviso != 'enviado'
        AND (reserva_hasta IS NULL OR reserva_hasta <= ${new Date().toISOString()})
    `);
    return resultado.meta.changes === 1;
  }

  /** Persiste cada intento antes de contactar al proveedor. */
  async registrarIntento(id: string, token: string): Promise<void> {
    const resultado = await this.db
      .update(solicitudes)
      .set({intentosAviso: sql`${solicitudes.intentosAviso} + 1`})
      .where(and(eq(solicitudes.id, id), eq(solicitudes.reservaToken, token)));
    if (resultado.meta.changes !== 1) throw new Error('Se perdió la reserva del aviso.');
  }

  /** Finaliza solamente la reserva de su propietario. */
  async actualizarAviso(
    id: string,
    token: string,
    cambio: {estado: EstadoAviso; error?: string},
  ): Promise<void> {
    const resultado = await this.db
      .update(solicitudes)
      .set({
        estadoAviso: cambio.estado,
        ultimoError: cambio.error ?? null,
        avisadoEn: cambio.estado === 'enviado' ? new Date().toISOString() : null,
        reservaToken: null,
        reservaHasta: null,
      })
      .where(and(eq(solicitudes.id, id), eq(solicitudes.reservaToken, token)));
    if (resultado.meta.changes !== 1) throw new Error('No se pudo finalizar la reserva del aviso.');
  }

  /** Limita de forma atómica a cinco intentos de acceso por diez minutos. */
  async permitirAcceso(ipHash: string): Promise<boolean> {
    const desde = new Date(Date.now() - 10 * 60000).toISOString();
    await this.db.delete(intentosAcceso).where(sql`${intentosAcceso.creadoEn} < ${desde}`);
    const resultado = await this.db.run(sql`
      INSERT INTO intentos_acceso (id, ip_hash, creado_en)
      SELECT ${crypto.randomUUID()}, ${ipHash}, ${new Date().toISOString()}
      WHERE (SELECT COUNT(*) FROM intentos_acceso
        WHERE ip_hash = ${ipHash} AND creado_en >= ${desde}) < 5
    `);
    return resultado.meta.changes === 1;
  }
}
