import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { orders, orderItems, cartItems, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      items: { productId: number; productName: string; quantity: number; unitPrice: number }[];
      shipping: number;
      tax: number;
      total: number;
      reference: string;
    }) => input,
  )
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id) throw new Error("Not authenticated");

    const db = getDb()!;

    const [order] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        status: "paid",
        total: Math.round(data.total * 100),
        shipping: Math.round(data.shipping * 100),
        tax: Math.round(data.tax * 100),
        reference: data.reference,
        paidAt: new Date(),
      })
      .returning();

    await db.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Math.round(item.unitPrice * 100),
      })),
    );

    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));

    return order;
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((input: { orderId: number }) => input)
  .handler(async (ctx) => {
    const { data } = ctx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = (ctx as any).request;
    const session = await auth.api.getSession({
      headers: request?.headers ?? new Headers(),
    });
    if (!session?.user?.id) throw new Error("Not authenticated");

    const db = getDb()!;

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, data.orderId), eq(orders.userId, session.user.id)))
      .limit(1);

    if (!order) throw new Error("Order not found");

    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productName: orderItems.productName,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        image: products.image,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    return { order, items };
  });
