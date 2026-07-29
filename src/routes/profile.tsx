import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, MapPin, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { allProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — VoltX" },
      { name: "description", content: "Manage your VoltX account, orders, and wishlist." },
    ],
  }),
  component: ProfilePage,
});

const mockOrders = [
  { id: "ORD-2026-001", date: "Apr 28, 2026", total: 1498, status: "Delivered", items: 2 },
  { id: "ORD-2026-002", date: "May 2, 2026", total: 298, status: "Shipped", items: 1 },
];

function ProfilePage() {
  const { wishlist } = useWishlist();
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
          <User className="h-10 w-10 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">Alex Johnson</h1>
          <p className="text-sm text-muted-foreground">alex.johnson@email.com</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Member since January 2025 • VoltX Gold Member
          </p>
        </div>
        <Button variant="glass" size="sm">
          <Settings className="mr-1.5 h-3.5 w-3.5" /> Edit Profile
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Package, label: "Orders", value: "12" },
          { icon: Heart, label: "Wishlist", value: String(wishlist.size) },
          { icon: MapPin, label: "Addresses", value: "2" },
          { icon: CreditCard, label: "Cards", value: "3" },
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
        <div className="space-y-3">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="glass-card flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-semibold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground">
                  {order.date} • {order.items} items
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-foreground">
                  ${order.total.toLocaleString()}
                </p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "Delivered" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
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
