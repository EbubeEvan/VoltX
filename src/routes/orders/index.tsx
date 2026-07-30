import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileData } from "@/lib/server/profile";
import { SkeletonProfile } from "@/components/PageSkeleton";

export const Route = createFileRoute("/orders/")({
  loader: async () => {
    try {
      const data = await getProfileData();
      return { session: data.session, orders: data.orders };
    } catch {
      return { session: null, orders: [] };
    }
  },
  pendingComponent: SkeletonProfile,
  head: () => ({
    meta: [
      { title: "My Orders — VoltX" },
      { name: "description", content: "View your VoltX order history." },
    ],
  }),
  component: OrdersIndex,
});

function orderIdString(id: number) {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(id).padStart(3, "0")}`;
}

function OrdersIndex() {
  const { session, orders } = Route.useLoaderData();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
      <p className="mt-1 text-muted-foreground">
        {user ? `Orders for ${user.name}` : "Your order history"}
      </p>

      <div className="mt-8">
        {orders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              When you place an order, it will appear here.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg" className="mt-6">
                <ShoppingBag className="mr-2 h-4 w-4" /> Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: String(order.id) }}
                  className="glass-card flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:border-primary/50"
                >
                  <div>
                    <p className="font-display font-semibold text-foreground">
                      {orderIdString(order.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" \u00B7 "}
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-foreground">
                      {"\u20A6"}
                      {(order.total / 100).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "delivered" || order.status === "shipped"
                          ? "bg-success/20 text-success"
                          : order.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-primary/20 text-primary"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
