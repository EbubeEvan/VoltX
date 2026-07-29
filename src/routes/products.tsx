import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { allProducts } from "@/data/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products — VoltX Electronics" },
      {
        name: "description",
        content:
          "Browse our full catalog of smartphones, laptops, TVs, audio equipment, and gaming accessories.",
      },
    ],
  }),
  component: ProductsPage,
});

const brands = ["All", "Apple", "Samsung", "Sony", "LG", "Razer", "Bose", "DJI"];
const sortOptions = [
  "Best Selling",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Top Rated",
];

function ProductsPage() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("Best Selling");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = allProducts.filter((p) => selectedBrand === "All" || p.brand === selectedBrand);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">All Products</h1>
        <p className="mt-2 text-muted-foreground">{sorted.length} products found</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            Filters
          </Button>

          {/* Brand filters */}
          <div className="hidden flex-wrap gap-2 sm:flex">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedBrand === brand
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-input bg-secondary px-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Mobile brand filters */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 flex flex-wrap gap-2 sm:hidden"
        >
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedBrand === brand
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {brand}
            </button>
          ))}
        </motion.div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
