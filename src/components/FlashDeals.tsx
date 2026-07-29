import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { value: pad(time.hours), label: "HRS" },
        { value: pad(time.minutes), label: "MIN" },
        { value: pad(time.seconds), label: "SEC" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="font-display rounded-lg bg-primary/20 px-3 py-1.5 text-xl font-bold text-primary">
              {unit.value}
            </span>
            <span className="mt-1 text-[10px] text-muted-foreground">{unit.label}</span>
          </div>
          {i < 2 && <span className="text-xl font-bold text-primary">:</span>}
        </div>
      ))}
    </div>
  );
}

export function FlashDeals({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="section-heading text-2xl text-foreground">Flash Deals</h2>
            <p className="text-sm text-muted-foreground">Limited time offers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ends in</span>
          <CountdownTimer />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
