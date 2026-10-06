import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';

export function crearHash(password: string) {
  const sal = randomBytes(16).toString('hex');
  return `scrypt:${sal}:${scryptSync(password, sal, 32).toString('hex')}`;
}

export function hashValido(hash: string) {
  return /^scrypt:[a-f0-9]{32}:[a-f0-9]{64}$/.test(hash);
}

export function verificarPassword(password: string, hash: string) {
  if (!hashValido(hash)) throw new Error('El hash del administrador no tiene un formato valido.');
  const [, sal, esperado] = hash.split(':');
  return timingSafeEqual(scryptSync(password, sal, 32), Buffer.from(esperado, 'hex'));
}
