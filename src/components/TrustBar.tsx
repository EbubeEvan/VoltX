import { Shield, Truck, Headphones, RotateCcw } from "lucide-react";

const badges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $99" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit encryption" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/50 bg-surface/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 lg:grid-cols-4 lg:px-8">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <badge.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
