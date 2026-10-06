import 'server-only';
import Database from 'better-sqlite3';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const globalDb = globalThis as typeof globalThis & {dannotechDb?: Database.Database};

export function getDirectorioDatos() {
  return path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
}

export function getDb() {
  if (globalDb.dannotechDb) return globalDb.dannotechDb;
  const directorio = getDirectorioDatos();
  mkdirSync(directorio, {recursive: true});
  const db = new Database(path.join(directorio, 'dannotech.sqlite'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.exec(
    'CREATE TABLE IF NOT EXISTS migraciones (version INTEGER PRIMARY KEY, fecha TEXT NOT NULL)',
  );
  const migrada = db.prepare('SELECT version FROM migraciones WHERE version = 1').get();
  if (!migrada) {
    db.transaction(() => {
      db.exec(`
        CREATE TABLE administrador (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          correo TEXT NOT NULL,
          password_hash TEXT NOT NULL
        );
        CREATE TABLE sesiones (
          token_hash TEXT PRIMARY KEY,
          administrador_id INTEGER NOT NULL REFERENCES administrador(id),
          vence INTEGER NOT NULL
        );
        CREATE TABLE consultas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT NOT NULL,
          mensaje TEXT NOT NULL,
          seleccion TEXT,
          fecha TEXT NOT NULL
        );
        CREATE TABLE importaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          componente TEXT NOT NULL,
          archivo TEXT NOT NULL,
          fecha TEXT NOT NULL,
          estado TEXT NOT NULL CHECK (estado IN ('recibido', 'invalido', 'importado', 'error'))
        );
        CREATE TABLE limites (
          clave TEXT PRIMARY KEY,
          cantidad INTEGER NOT NULL,
          vence INTEGER NOT NULL
        );
      `);
      db.prepare('INSERT INTO migraciones (version, fecha) VALUES (1, ?)').run(
        new Date().toISOString(),
      );
    })();
  }
  globalDb.dannotechDb = db;
  return db;
}

export function consumirLimite(clave: string, maximo: number, ventanaMs: number) {
  const db = getDb();
  const ahora = Date.now();
  return db.transaction(() => {
    db.prepare('DELETE FROM limites WHERE vence <= ?').run(ahora);
    db.prepare(
      `
      INSERT INTO limites (clave, cantidad, vence) VALUES (?, 1, ?)
      ON CONFLICT(clave) DO UPDATE SET cantidad = cantidad + 1
    `,
    ).run(clave, ahora + ventanaMs);
    const registro = db.prepare('SELECT cantidad FROM limites WHERE clave = ?').get(clave) as {
      cantidad: number;
    };
    return registro.cantidad <= maximo;
  })();
}
