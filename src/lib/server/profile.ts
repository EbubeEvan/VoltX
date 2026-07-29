import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { products, orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const getProfileData = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const db = getDb()!;
  const ctx = context as unknown as { request: Request } | undefined;
  const session = await auth.api.getSession({
    headers: ctx?.request?.headers ?? new Headers(),
  });
  let userOrders: (typeof orders.$inferSelect)[] = [];
  if (session?.user?.id) {
    userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));
  }
  const all = await db.select().from(products).orderBy(products.id);
  return { session, orders: userOrders, allProducts: all };
});

export const getCheckoutSession = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const ctx = context as unknown as { request: Request } | undefined;
  const session = await auth.api.getSession({
    headers: ctx?.request?.headers ?? new Headers(),
  });
  return session?.user ?? null;
});
