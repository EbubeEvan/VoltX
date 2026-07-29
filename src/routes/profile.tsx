import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/ProductCard";
import { toCardProducts } from "@/lib/mappers";
import { getProfileData } from "@/lib/server/profile";
import { SkeletonProfile } from "@/components/PageSkeleton";

export const Route = createFileRoute("/profile")({
  loader: async () => {
    const data = await getProfileData();
    return {
      session: data.session,
      orders: data.orders,
      allProducts: toCardProducts(data.allProducts),
    };
  },
  pendingComponent: SkeletonProfile,
  head: () => ({
    meta: [
      { title: "My Profile — VoltX" },
      { name: "description", content: "Manage your VoltX account, orders, and wishlist." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session, orders, allProducts } = Route.useLoaderData();
  const { wishlist } = useWishlist();
  const user = session?.user;
  const wishlisted = allProducts.filter((p) => wishlist.has(p.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-wrap items-center gap-6 p-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          {user?.image ? (
            <img src={user.image} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-primary" />
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
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Package, label: "Orders", value: String(orders.length) },
          { icon: Heart, label: "Wishlist", value: String(wishlist.size) },
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
              <div
                key={order.id}
                className="glass-card flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">#{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-foreground">
                    ₦{(order.total / 100).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "delivered" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wishlist */}
      <section className="mt-10">
        <h2 className="section-heading mb-4 text-xl text-foreground">My Wishlist</h2>
        {wishlisted.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              Your wishlist is empty. Browse products and tap the heart icon to save items.
            </p>
            <Link to="/products">
              <Button variant="glass" size="sm" className="mt-4">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlisted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
