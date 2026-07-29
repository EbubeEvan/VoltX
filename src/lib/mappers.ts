import type { Product as DBProduct } from "@/lib/db/schema";
import type { Product as CardProduct } from "@/components/ProductCard";

export function toCardProduct(p: DBProduct): CardProduct {
  return {
    id: String(p.id),
    name: p.name,
    brand: p.brand,
    price: p.price / 100,
    originalPrice: p.originalPrice ? p.originalPrice / 100 : undefined,
    image: p.image,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    badge: p.badge ?? undefined,
    inStock: p.inStock ?? true,
  };
}

export function toCardProducts(products: DBProduct[]): CardProduct[] {
  return products.map(toCardProduct);
}
