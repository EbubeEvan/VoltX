import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { cartItems, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const getCart = createServerFn({ method: "GET" }).handler(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = (ctx as any).request;
  const session = await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
  if (!session?.user?.id) return [];
  const db = getDb()!;
  return db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, session.user.id));
});

export const addToCart = createServerFn({ method: "POST" })
  .inputValidator((input: { productId: number; quantity?: number }) => input)
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
      .from(cartItems)
      .where(and(eq(cartItems.userId, session.user.id), eq(cartItems.productId, data.productId)));
    if (existing.length > 0) {
      await db
        .update(cartItems)
        .set({
          quantity: existing[0].quantity + (data.quantity ?? 1),
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      await db.insert(cartItems).values({
        userId: session.user.id,
        productId: data.productId,
        quantity: data.quantity ?? 1,
      });
    }
  });

export const removeFromCart = createServerFn({ method: "POST" })
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
      .delete(cartItems)
      .where(and(eq(cartItems.userId, session.user.id), eq(cartItems.productId, data.productId)));
  });

export const updateCartQuantity = createServerFn({ method: "POST" })
  .inputValidator((input: { productId: number; quantity: number }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id) return;
    const db = getDb()!;
    if (data.quantity <= 0) {
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.userId, session.user.id), eq(cartItems.productId, data.productId)));
    } else {
      await db
        .update(cartItems)
        .set({ quantity: data.quantity, updatedAt: new Date() })
        .where(and(eq(cartItems.userId, session.user.id), eq(cartItems.productId, data.productId)));
    }
  });

export const mergeCart = createServerFn({ method: "POST" })
  .inputValidator((input: { items: { productId: number; quantity: number }[] }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id || data.items.length === 0) return;
    const db = getDb()!;
    for (const item of data.items) {
      const existing = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, session.user.id), eq(cartItems.productId, item.productId)));
      if (existing.length > 0) {
        await db
          .update(cartItems)
          .set({
            quantity: item.quantity,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        await db.insert(cartItems).values({
          userId: session.user.id,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }
  });
