import {randomBytes, scryptSync} from 'node:crypto';

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 12 || password.length > 256) {
  console.error(
    'Define ADMIN_PASSWORD con una clave de 12 a 256 caracteres solo para este comando.',
  );
  process.exitCode = 1;
} else {
  const sal = randomBytes(16).toString('hex');
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${sal}:${scryptSync(password, sal, 32).toString('hex')}`);
}
