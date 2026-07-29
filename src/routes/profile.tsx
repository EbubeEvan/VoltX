import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, Settings, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileData } from "@/lib/server/profile";
import { SkeletonProfile } from "@/components/PageSkeleton";

export const Route = createFileRoute("/profile")({
  loader: async () => {
    const data = await getProfileData();
    return { session: data.session, orders: data.orders };
  },
  pendingComponent: SkeletonProfile,
  head: () => ({
    meta: [
      { title: "My Profile — VoltX" },
      { name: "description", content: "Manage your VoltX account and orders." },
    ],
  }),
  component: ProfilePage,
});

function orderIdString(id: number) {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(id).padStart(3, "0")}`;
}

function ProfilePage() {
  const { session, orders } = Route.useLoaderData();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-wrap items-center gap-6 p-6"
      >
        <div className="overflow-hidden rounded-full">
          {user?.image ? (
            <img src={user.image} alt="" className="h-20 w-20 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center bg-primary/20 font-display text-lg font-bold text-primary">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?"}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {user?.name || "Guest"}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
        </div>
        {user && (
          <Button variant="glass" size="sm">
            <Settings className="mr-1.5 h-3.5 w-3.5" /> Edit Profile
          </Button>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { icon: Package, label: "Orders", value: String(orders.length) },
          { icon: MapPin, label: "Addresses", value: "0" },
          { icon: CreditCard, label: "Cards", value: "0" },
        ].map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 text-center"
          >
            <Icon className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <section className="mt-10">
        <h2 className="section-heading mb-4 text-xl text-foreground">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No orders yet.</p>
            <Link to="/products">
              <Button variant="glass" size="sm" className="mt-4">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
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
                    {" • "}
                    {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-foreground">
                    ₦{(order.total / 100).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "delivered" || order.status === "shipped" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
