import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost || !sqlDbName || !user || !password) {
  // During local development, these might be missing until the proxy is up.
  // We'll provide dummy values to prevent crash during build, but the UpdateSchema tool handles the real env.
  console.warn("SQL environment variables missing. Drizzle Kit may fail if not running in the correct environment.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost || "localhost",
    user: user || "admin",
    password: password || "password",
    database: sqlDbName || "postgres",
    ssl: false,
  },
  verbose: true,
});
