import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  return getDb()!.select().from(products).orderBy(products.id);
});

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const [product] = await getDb()!.select().from(products).where(eq(products.id, id));
    return product || null;
  });

export const getFeaturedProducts = createServerFn({ method: "GET" }).handler(async () => {
  return getDb()!
    .select()
    .from(products)
    .where(sql`id <= 6`)
    .orderBy(products.id);
});

export const getNewArrivals = createServerFn({ method: "GET" }).handler(async () => {
  return getDb()!
    .select()
    .from(products)
    .where(sql`id >= 7 AND id <= 10`)
    .orderBy(products.id);
});

export const getFlashDeals = createServerFn({ method: "GET" }).handler(async () => {
  return getDb()!
    .select()
    .from(products)
    .where(sql`id >= 11 AND id <= 13`)
    .orderBy(products.id);
});

export const getProductsByBrand = createServerFn({ method: "GET" })
  .inputValidator((brand: string) => brand)
  .handler(async ({ data: brand }) => {
    return getDb()!.select().from(products).where(eq(products.brand, brand)).orderBy(products.id);
  });

export const getHomePageData = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb()!;
  const [featured, arrivals, deals] = await Promise.all([
    db
      .select()
      .from(products)
      .where(sql`id <= 6`)
      .orderBy(products.id),
    db
      .select()
      .from(products)
      .where(sql`id >= 7 AND id <= 10`)
      .orderBy(products.id),
    db
      .select()
      .from(products)
      .where(sql`id >= 11 AND id <= 13`)
      .orderBy(products.id),
  ]);
  return { featured, arrivals, deals };
});
