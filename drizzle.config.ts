import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: ['./src/modules/formularios/db/esquema.ts', './src/modules/administracion/esquema.ts'],
  out: './drizzle',
});
