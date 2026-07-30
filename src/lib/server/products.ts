import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import type { Product } from "@/lib/db/schema";
import { fallbackProducts } from "@/lib/db/fallback";
import { eq } from "drizzle-orm";

async function allProducts(): Promise<Product[]> {
  const db = getDb();
  if (!db) return fallbackProducts;
  try {
    return (await db.select().from(products).orderBy(products.id)) as Product[];
  } catch (error) {
    console.error("Falling back to static catalogue:", error);
    return fallbackProducts;
  }
}

function range(list: Product[], min: number, max: number) {
  return list.filter((p) => p.id >= min && p.id <= max);
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => allProducts());

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = getDb();
    if (db) {
      try {
        const [product] = await db.select().from(products).where(eq(products.id, id));
        return (product as Product) ?? null;
      } catch (error) {
        console.error("Falling back to static catalogue:", error);
      }
    }
    return fallbackProducts.find((p) => p.id === id) ?? null;
  });

export const getFeaturedProducts = createServerFn({ method: "GET" }).handler(async () =>
  range(await allProducts(), 1, 6),
);

export const getNewArrivals = createServerFn({ method: "GET" }).handler(async () =>
  range(await allProducts(), 7, 10),
);

export const getFlashDeals = createServerFn({ method: "GET" }).handler(async () =>
  range(await allProducts(), 11, 13),
);

export const getProductsByBrand = createServerFn({ method: "GET" })
  .inputValidator((brand: string) => brand)
  .handler(async ({ data: brand }) => {
    const db = getDb();
    if (db) {
      try {
        return (await db
          .select()
          .from(products)
          .where(eq(products.brand, brand))
          .orderBy(products.id)) as Product[];
      } catch (error) {
        console.error("Falling back to static catalogue:", error);
      }
    }
    return fallbackProducts.filter((p) => p.brand === brand);
  });

export const getHomePageData = createServerFn({ method: "GET" }).handler(async () => {
  const list = await allProducts();
  return {
    featured: range(list, 1, 6),
    arrivals: range(list, 7, 10),
    deals: range(list, 11, 13),
  };
});
