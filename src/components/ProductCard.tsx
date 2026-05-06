import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  inStock?: boolean;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="glass-card group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-neon)]"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
          {product.badge}
        </div>
      )}
      {discount > 0 && (
        <div className="absolute right-3 top-3 z-10 rounded-md bg-sale px-2.5 py-1 text-xs font-bold text-primary-foreground">
          -{discount}%
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30 p-6">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <Button variant="glass" size="icon" className="h-10 w-10 rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="neon" size="icon" className="h-10 w-10 rounded-full">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button variant="glass" size="icon" className="h-10 w-10 rounded-full">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        {product.inStock === false && (
          <p className="mt-2 text-xs font-medium text-destructive">Out of Stock</p>
        )}
      </div>
    </motion.div>
  );
}
