import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const createOrderSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    }),
  ),
  shipping: z.number(),
  tax: z.number(),
  total: z.number(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderSchema)
  .handler(async ({ data }) => {
    return getDb()!.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId: data.userId,
          status: "pending",
          total: data.total,
          shipping: data.shipping,
          tax: data.tax,
        })
        .returning();

      await tx.insert(orderItems).values(
        data.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      );

      return order;
    });
  });

export const getUserOrders = createServerFn({ method: "GET" })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    return getDb()!
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  });

export const getOrderWithItems = createServerFn({ method: "GET" })
  .inputValidator((orderId: number) => orderId)
  .handler(async ({ data: orderId }) => {
    const [order] = await getDb()!.select().from(orders).where(eq(orders.id, orderId));
    if (!order) return null;
    const items = await getDb()!.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    return { ...order, items };
  });
