import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Next-gen electronics"
          className="h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-background/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              New Season Drop
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Next-Gen Tech, Delivered.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Discover the latest smartphones, laptops, and smart devices from the world's leading
            brands. Premium tech at unbeatable prices.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/products">
              <Button variant="hero" size="xl">
                Shop Now <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/deals">
              <Button variant="glass" size="xl">
                Explore Deals
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-10">
            {[
              { value: "15", label: "Products" },
              { value: "5000", label: "Happy Customers" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
