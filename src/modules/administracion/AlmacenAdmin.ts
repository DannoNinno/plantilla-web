import 'server-only';
import {adminConfig} from '../../domain/configuracion/administracion';

export class AlmacenAdmin {
  constructor(
    private readonly db: D1Database,
    private readonly config = adminConfig,
  ) {}

  async estaBloqueado(ipHash: string, ahora = Date.now()): Promise<boolean> {
    const fila = await this.db
      .prepare('SELECT bloqueado_hasta FROM accesos_admin WHERE ip_hash = ?')
      .bind(ipHash)
      .first<{bloqueado_hasta: number}>();
    return Boolean(fila && fila.bloqueado_hasta > ahora);
  }

  async registrarFallo(ipHash: string, ahora = Date.now()): Promise<boolean> {
    const fila = await this.db
      .prepare(
        `
        INSERT INTO accesos_admin (ip_hash, fallos, bloqueado_hasta)
        VALUES (?1, 1, CASE WHEN ?2 = 1 THEN ?3 ELSE 0 END)
        ON CONFLICT(ip_hash) DO UPDATE SET
          fallos = CASE WHEN accesos_admin.bloqueado_hasta > 0 THEN 1 ELSE MIN(accesos_admin.fallos + 1, ?2) END,
          bloqueado_hasta = CASE
            WHEN accesos_admin.bloqueado_hasta > 0 THEN CASE WHEN ?2 = 1 THEN ?3 ELSE 0 END
            WHEN accesos_admin.fallos + 1 >= ?2 THEN ?3 ELSE 0 END
        WHERE accesos_admin.bloqueado_hasta <= ?4
        RETURNING bloqueado_hasta
      `,
      )
      .bind(ipHash, this.config.maximosFallos, ahora + this.config.bloqueoMinutos * 60000, ahora)
      .first<{bloqueado_hasta: number}>();
    return !fila || fila.bloqueado_hasta > ahora;
  }

  async registrarExito(ipHash: string, ahora = Date.now()): Promise<boolean> {
    const fila = await this.db
      .prepare(
        `
        INSERT INTO accesos_admin (ip_hash, fallos, bloqueado_hasta) VALUES (?1, 0, 0)
        ON CONFLICT(ip_hash) DO UPDATE SET fallos = 0, bloqueado_hasta = 0
        WHERE accesos_admin.bloqueado_hasta <= ?2
        RETURNING ip_hash
      `,
      )
      .bind(ipHash, ahora)
      .first<{ip_hash: string}>();
    return Boolean(fila);
  }

  async iniciarSesion(id: string, ahora = Date.now()): Promise<void> {
    await this.db
      .prepare('DELETE FROM sesiones_admin WHERE ultima_actividad <= ?')
      .bind(ahora - this.config.inactividadMinutos * 60000)
      .run();
    await this.db
      .prepare('INSERT INTO sesiones_admin (id, ultima_actividad) VALUES (?, ?)')
      .bind(id, ahora)
      .run();
  }

  async sesionVigente(id: string, ahora = Date.now()): Promise<boolean> {
    const fila = await this.db
      .prepare('SELECT id FROM sesiones_admin WHERE id = ? AND ultima_actividad > ?')
      .bind(id, ahora - this.config.inactividadMinutos * 60000)
      .first<{id: string}>();
    return Boolean(fila);
  }

  async renovarSesion(id: string, ahora = Date.now(), inactividadMs = 0): Promise<boolean> {
    const resultado = await this.db
      .prepare(
        'UPDATE sesiones_admin SET ultima_actividad = MAX(ultima_actividad, ?1) WHERE id = ?2 AND ultima_actividad > ?3',
      )
      .bind(ahora - inactividadMs, id, ahora - this.config.inactividadMinutos * 60000)
      .run();
    return resultado.meta.changes === 1;
  }

  async cerrarSesion(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM sesiones_admin WHERE id = ?').bind(id).run();
  }
}
