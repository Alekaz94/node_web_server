import { defineConfig } from 'drizzle-kit';
import { config } from './src/config.js';

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: 'src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.dbURL,
  },
});

// 'postgres://postgres:postgres@localhost:5432/chirpy'
