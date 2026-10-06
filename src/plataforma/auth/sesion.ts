import 'server-only';
import {createHash, randomBytes} from 'node:crypto';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {getDb} from '@/plataforma/datos/sqlite';
import {hashValido, verificarPassword} from './password';

const COOKIE = 'dannotech-sesion';
const DURACION = 8 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function administradorConfigurado() {
  const db = getDb();
  if (db.prepare('SELECT id FROM administrador WHERE id = 1').get()) return true;
  const correo = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!correo || !hash) return false;
  if (!hashValido(hash) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new Error('Revisa ADMIN_EMAIL y ADMIN_PASSWORD_HASH: su formato no es valido.');
  }
  db.prepare('INSERT INTO administrador (id, correo, password_hash) VALUES (1, ?, ?)').run(
    correo.toLowerCase(),
    hash,
  );
  return true;
}

export async function iniciarSesion(correo: string, password: string) {
  if (!administradorConfigurado()) return false;
  const db = getDb();
  const administrador = db
    .prepare('SELECT correo, password_hash FROM administrador WHERE id = 1')
    .get() as {correo: string; password_hash: string};
  const correcto = verificarPassword(password, administrador.password_hash);
  if (!correcto || administrador.correo !== correo.toLowerCase()) return false;
  const token = randomBytes(32).toString('hex');
  const vence = Date.now() + DURACION;
  db.prepare('DELETE FROM sesiones WHERE vence <= ?').run(Date.now());
  db.prepare('INSERT INTO sesiones (token_hash, administrador_id, vence) VALUES (?, 1, ?)').run(
    hashToken(token),
    vence,
  );
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(vence),
  });
  return true;
}

export async function getSesion() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return getDb()
    .prepare(
      `
    SELECT a.correo FROM sesiones s JOIN administrador a ON a.id = s.administrador_id
    WHERE s.token_hash = ? AND s.vence > ?
  `,
    )
    .get(hashToken(token), Date.now()) as {correo: string} | undefined;
}

export async function exigirSesion() {
  const sesion = await getSesion();
  if (!sesion) redirect('/admin/login');
  return sesion;
}

export async function cerrarSesion() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare('DELETE FROM sesiones WHERE token_hash = ?').run(hashToken(token));
  jar.delete(COOKIE);
}
