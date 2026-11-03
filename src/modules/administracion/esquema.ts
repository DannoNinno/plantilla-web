import {index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const accesosAdmin = sqliteTable('accesos_admin', {
  ipHash: text('ip_hash').primaryKey(),
  fallos: integer('fallos').notNull().default(0),
  bloqueadoHasta: integer('bloqueado_hasta').notNull().default(0),
});

export const sesionesAdmin = sqliteTable(
  'sesiones_admin',
  {
    id: text('id').primaryKey(),
    ultimaActividad: integer('ultima_actividad').notNull(),
  },
  (tabla) => [index('sesiones_admin_actividad_idx').on(tabla.ultimaActividad)],
);
