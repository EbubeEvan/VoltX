import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { wishlistItems, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const getWishlist = createServerFn({ method: "GET" }).handler(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = (ctx as any).request;
  const session = await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
  if (!session?.user?.id) return [];
  const db = getDb()!;
  return db
    .select({ product: products })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, session.user.id));
});

export const addToWishlist = createServerFn({ method: "POST" })
  .inputValidator((input: { productId: number }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id) return;
    const db = getDb()!;
    const existing = await db
      .select()
      .from(wishlistItems)
      .where(
        and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, data.productId)),
      );
    if (existing.length === 0) {
      await db.insert(wishlistItems).values({
        userId: session.user.id,
        productId: data.productId,
      });
    }
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .inputValidator((input: { productId: number }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id) return;
    const db = getDb()!;
    await db
      .delete(wishlistItems)
      .where(
        and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, data.productId)),
      );
  });

export const mergeWishlist = createServerFn({ method: "POST" })
  .inputValidator((input: { productIds: number[] }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id || data.productIds.length === 0) return;
    const db = getDb()!;
    for (const productId of data.productIds) {
      const existing = await db
        .select()
        .from(wishlistItems)
        .where(
          and(eq(wishlistItems.userId, session.user.id), eq(wishlistItems.productId, productId)),
        );
      if (existing.length === 0) {
        await db.insert(wishlistItems).values({
          userId: session.user.id,
          productId,
        });
      }
    }
  });
