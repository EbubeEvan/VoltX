import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let _client: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_client && process.env.DATABASE_URL) {
    _client = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return _client;
}
