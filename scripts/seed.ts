import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { products } from "../src/lib/db/schema";
import { seedProducts } from "../src/lib/db/seed-data";

async function main() {
  if (!process.env.DATABASE_URL) {
    const envPath = resolve(process.cwd(), ".env.local");
    if (existsSync(envPath)) {
      for (const line of readFileSync(envPath, "utf-8").split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...rest] = trimmed.split("=");
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
    }
  }

  const db = drizzle(neon(process.env.DATABASE_URL!));

  console.log("Clearing existing products with sequence reset...");
  await db.execute(sql`TRUNCATE products RESTART IDENTITY CASCADE`);

  const seedData = seedProducts;

  console.log(`Seeding ${seedData.length} products...`);
  await db.insert(products).values(seedData);
  console.log("Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
