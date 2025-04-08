import type { Config } from 'drizzle-kit';

export default {
  schema: './server/shared/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;