import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, Settings, MapPin, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileData } from "@/lib/server/profile";
import { SkeletonProfile } from "@/components/PageSkeleton";

export const Route = createFileRoute("/profile")({
  loader: async () => {
    try {
      const data = await getProfileData();
      if (!data.session) throw redirect({ to: "/login" });
      return { session: data.session, orders: data.orders };
    } catch {
      throw redirect({ to: "/login" });
    }
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

      {/* View Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Link to="/orders">
          <Button variant="glass" size="lg" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" /> View All Orders
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
