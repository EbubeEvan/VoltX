import type { Product } from "./schema";
import { seedProducts } from "./seed-data";

/**
 * Static catalogue used when DATABASE_URL is not configured, so the storefront
 * still renders instead of crashing with a 500.
 */
export const fallbackProducts: Product[] = seedProducts.map((p, i) => ({
  id: i + 1,
  name: p.name,
  brand: p.brand,
  price: p.price,
  originalPrice: p.originalPrice ?? null,
  image: p.image,
  images: p.images ?? null,
  rating: p.rating ?? 0,
  reviews: p.reviews ?? 0,
  badge: p.badge ?? null,
  category: p.category ?? null,
  description: p.description ?? null,
  specs: p.specs ?? null,
  highlights: p.highlights ?? null,
  colors: p.colors ?? null,
  storageOptions: p.storageOptions ?? null,
  ratingBreakdown: p.ratingBreakdown ?? null,
  inStock: p.inStock ?? true,
  createdAt: new Date(0),
})) as Product[];
