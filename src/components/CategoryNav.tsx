import { motion } from "framer-motion";
import { Smartphone, Laptop, Tv, Headphones, Gamepad2, Home, Watch } from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "TVs", icon: Tv },
  { name: "Audio", icon: Headphones },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Smart Home", icon: Home },
  { name: "Wearables", icon: Watch },
];

export function CategoryNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="glass-card group flex min-w-[120px] flex-col items-center gap-3 px-6 py-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-neon)]"
          >
            <cat.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
