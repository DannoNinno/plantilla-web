import {sql} from 'drizzle-orm';
import {check, index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const solicitudes = sqliteTable(
  'solicitudes',
  {
    id: text('id').primaryKey(),
    tipo: text('tipo', {enum: ['consulta', 'cotizacion']}).notNull(),
    nombre: text('nombre').notNull(),
    email: text('email'),
    datos: text('datos', {mode: 'json'}).$type<Record<string, string>>().notNull(),
    estadoAviso: text('estado_aviso', {enum: ['pendiente', 'enviado', 'fallido']})
      .notNull()
      .default('pendiente'),
    intentosAviso: integer('intentos_aviso').notNull().default(0),
    ultimoError: text('ultimo_error'),
    ipHash: text('ip_hash').notNull(),
    leida: integer('leida', {mode: 'boolean'}).notNull().default(false),
    creadoEn: text('creado_en').notNull(),
    avisadoEn: text('avisado_en'),
    reservaToken: text('reserva_token'),
    reservaHasta: text('reserva_hasta'),
  },
  (tabla) => [
    index('solicitudes_creado_idx').on(tabla.creadoEn),
    index('solicitudes_ip_creado_idx').on(tabla.ipHash, tabla.creadoEn),
    index('solicitudes_estado_idx').on(tabla.estadoAviso),
    check('solicitudes_tipo_check', sql`${tabla.tipo} IN ('consulta', 'cotizacion')`),
    check(
      'solicitudes_estado_check',
      sql`${tabla.estadoAviso} IN ('pendiente', 'enviado', 'fallido')`,
    ),
  ],
);

export const intentosAcceso = sqliteTable(
  'intentos_acceso',
  {
    id: text('id').primaryKey(),
    ipHash: text('ip_hash').notNull(),
    creadoEn: text('creado_en').notNull(),
  },
  (tabla) => [index('intentos_acceso_ip_fecha_idx').on(tabla.ipHash, tabla.creadoEn)],
);
