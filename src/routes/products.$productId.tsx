import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronLeft, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductDetail, featuredProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => {
    const product = getProductDetail(params.productId);
    return {
      meta: [
        { title: product ? `${product.name} — VoltX` : "Product — VoltX" },
        { name: "description", content: product?.description || "" },
      ],
    };
  },
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-foreground">Product Not Found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse all products</Link>
      </div>
    </div>
  ),
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = getProductDetail(productId);
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Product Not Found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse all products</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const liked = isWishlisted(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="glass-card relative aspect-square overflow-hidden p-8">
            {product.badge && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {product.badge}
              </div>
            )}
            <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-contain" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`glass-card h-20 w-20 overflow-hidden p-2 transition-all ${selectedImage === i ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">{product.brand}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-foreground">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
                <span className="rounded-md bg-sale px-2 py-0.5 text-sm font-bold text-primary-foreground">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="glass-card flex items-center gap-3 px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button variant="hero" size="xl" onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              variant="glass"
              size="icon"
              className={`h-12 w-12 ${liked ? "text-sale" : ""}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders $99+" },
              { icon: Shield, label: "2-Year Warranty", sub: "Full coverage" },
              { icon: RotateCcw, label: "30-Day Returns", sub: "No hassle" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1 text-xs font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="border-t border-border/50 pt-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Specifications</h3>
            <dl className="mt-4 space-y-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-medium text-foreground">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="section-heading mb-8 text-2xl text-foreground">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.filter((p) => p.id !== product.id).slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
