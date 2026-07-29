import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { getProducts } from "@/lib/server/products";
import { toCardProducts } from "@/lib/mappers";
import { SkeletonGrid } from "@/components/PageSkeleton";

export const Route = createFileRoute("/wishlist")({
  loader: async () => ({
    all: toCardProducts(await getProducts()),
  }),
  pendingComponent: SkeletonGrid,
  head: () => ({
    meta: [
      { title: "My Wishlist — VoltX" },
      {
        name: "description",
        content: "View your saved products at VoltX Electronics.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { all } = Route.useLoaderData();
  const { wishlist } = useWishlist();
  const items = all.filter((p) => wishlist.has(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-sale" />
        <h1 className="font-display text-3xl font-bold text-foreground">My Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground self-end ml-2">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap the heart icon on any product to save it here.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg" className="mt-6">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
