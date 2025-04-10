import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/shared/schema.ts',
  out: './drizzle/migrations',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ connection string for Neon PostgreSQL
  },
});

