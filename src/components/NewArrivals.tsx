import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import { PackagePlus } from "lucide-react";

export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <PackagePlus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="section-heading text-2xl text-foreground">New Arrivals</h2>
          <p className="text-sm text-muted-foreground">Fresh drops this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
