import 'server-only';

export class D1Almacen {
  constructor(private readonly db: D1Database) {}

  async permitirAcceso(ipHash: string): Promise<boolean> {
    const desde = new Date(Date.now() - 10 * 60000).toISOString();
    await this.db.prepare('DELETE FROM intentos_acceso WHERE creado_en < ?').bind(desde).run();
    const resultado = await this.db
      .prepare(
        `
      INSERT INTO intentos_acceso (id, ip_hash, creado_en)
      SELECT ?, ?, ?
      WHERE (SELECT COUNT(*) FROM intentos_acceso
        WHERE ip_hash = ? AND creado_en >= ?) < 5
    `,
      )
      .bind(crypto.randomUUID(), ipHash, new Date().toISOString(), ipHash, desde)
      .run();
    return resultado.meta.changes === 1;
  }
}
