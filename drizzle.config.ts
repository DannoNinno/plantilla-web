import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/modules/formularios/db/esquema.ts',
  out: './drizzle',
});
