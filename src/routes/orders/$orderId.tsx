import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/server/orders";
import { SkeletonOrder } from "@/components/PageSkeleton";

export const Route = createFileRoute("/orders/$orderId")({
  loader: async ({ params }) => {
    const result = await getOrder({ data: { orderId: Number(params.orderId) } });
    return result;
  },
  pendingComponent: SkeletonOrder,
  errorComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-xl font-bold text-foreground">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This order doesn't exist or you don't have access to it.
        </p>
        <Link to="/profile">
          <Button variant="hero" size="lg" className="mt-6">
            Back to Profile
          </Button>
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Order ORD-${new Date().getFullYear()}-${String(loaderData.order.id).padStart(3, "0")} — VoltX`
          : "Order — VoltX",
      },
      { name: "robots", content: "noindex" },
    ],
  }),

  component: OrderPage,
});

function orderIdString(id: number) {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(id).padStart(3, "0")}`;
}

function OrderPage() {
  const { order, items } = Route.useLoaderData();
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>

        <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {orderIdString(order.id)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {order.reference && (
              <p className="text-xs text-muted-foreground">Ref: {order.reference}</p>
            )}
          </div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              order.status === "delivered" || order.status === "shipped"
                ? "bg-success/20 text-success"
                : "bg-primary/20 text-primary"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </motion.div>

      {/* Items */}
      <section className="mt-8">
        <h2 className="section-heading mb-4 text-lg text-foreground">Items ({items.length})</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex items-center gap-4 p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary/30 p-2">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{item.productName}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-foreground">
                  ₦{((item.unitPrice * item.quantity) / 100).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₦{(item.unitPrice / 100).toLocaleString()} each
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mt-8 space-y-3 p-6"
      >
        <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₦{(subtotal / 100).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">
              {order.shipping === 0 ? "FREE" : `₦${(order.shipping / 100).toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">₦{(order.tax / 100).toLocaleString()}</span>
          </div>
        </div>
        <div className="border-t border-border/50 pt-3">
          <div className="flex justify-between">
            <span className="font-display text-lg font-bold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-foreground">
              ₦{(order.total / 100).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
