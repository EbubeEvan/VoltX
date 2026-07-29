import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { products, orders, orderItems } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const getProfileData = createServerFn({ method: "GET" }).handler(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = (ctx as any).request;
  const db = getDb()!;
  const session = await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
  type OrderWithCount = typeof orders.$inferSelect & { itemCount: number };
  let userOrders: OrderWithCount[] = [];
  if (session?.user?.id) {
    userOrders = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        total: orders.total,
        shipping: orders.shipping,
        tax: orders.tax,
        reference: orders.reference,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        itemCount: sql<number>`count(${orderItems.id})`,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.userId, session.user.id))
      .groupBy(orders.id)
      .orderBy(desc(orders.createdAt));
  }
  const all = await db.select().from(products).orderBy(products.id);
  return { session, orders: userOrders, allProducts: all };
});

export const getCheckoutSession = createServerFn({ method: "GET" }).handler(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = (ctx as any).request;
  const session = await auth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
  return session?.user ?? null;
});
