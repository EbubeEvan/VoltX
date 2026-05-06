import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingCart, Star, Minus, Plus, Shield, Truck, RotateCcw,
  Share2, Check, ThumbsUp, ChevronDown, ChevronUp, Zap, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductDetail, featuredProducts } from "@/data/products";
import type { ReviewData } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export const Route = createFileRoute("/products_/$productId")({
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
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.description, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const reviews = product.customerReviews || [];
  const ratingBreakdown = product.ratingBreakdown || {};
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="glass-card relative aspect-square overflow-hidden p-8">
            {product.badge && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {product.badge}
              </div>
            )}
            {discount > 0 && (
              <div className="absolute right-4 top-4 z-10 rounded-md bg-sale px-3 py-1 text-xs font-bold text-primary-foreground">
                -{discount}%
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
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

        {/* Product Info */}
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
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
            <button onClick={() => setActiveTab("reviews")} className="text-sm text-primary hover:underline">Read reviews</button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-foreground">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
                <span className="rounded-md bg-sale px-2 py-0.5 text-sm font-bold text-primary-foreground">Save ${(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              In Stock — Ships within 24h
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Key Features</h3>
              <ul className="space-y-1.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Color: <span className="font-normal text-muted-foreground">{product.colors[selectedColor].name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`relative h-10 w-10 rounded-full border-2 transition-all ${selectedColor === i ? "border-primary scale-110" : "border-border/50 hover:border-muted-foreground"}`}
                    title={color.name}
                  >
                    <span className="absolute inset-1 rounded-full" style={{ backgroundColor: color.hex }} />
                    {selectedColor === i && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Options */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Storage</h3>
              <div className="flex flex-wrap gap-2">
                {product.storageOptions.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedStorage(i)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${selectedStorage === i ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-card flex items-center gap-3 px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button variant="hero" size="xl" onClick={handleAddToCart} className="flex-1" disabled={addedToCart}>
              {addedToCart ? (
                <><Check className="mr-2 h-5 w-5" /> Added!</>
              ) : (
                <><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</>
              )}
            </Button>
            <Button
              variant="glass"
              size="icon"
              className={`h-12 w-12 ${liked ? "text-sale" : ""}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="glass" size="icon" className="h-12 w-12" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
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
        </motion.div>
      </div>

      {/* Tabs Section */}
      <section className="mt-16">
        <div className="flex gap-1 border-b border-border/50">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "reviews" ? `Reviews (${product.reviews.toLocaleString()})` : tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <p className="max-w-3xl text-muted-foreground leading-relaxed">{product.description}</p>
                {product.highlights && product.highlights.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {product.highlights.map((h) => (
                      <div key={h} className="glass-card flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm text-foreground">{h}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* What's in the box */}
                <div className="glass-card p-6">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                    <Package className="h-5 w-5 text-primary" /> What's in the Box
                  </h3>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[`1x ${product.name}`, "USB-C Cable", "Quick Start Guide", "Warranty Card"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="glass-card overflow-hidden">
                  <dl className="divide-y divide-border/30">
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <div key={key} className={`flex justify-between px-6 py-4 text-sm ${i % 2 === 0 ? "bg-secondary/20" : ""}`}>
                        <dt className="font-medium text-muted-foreground">{key}</dt>
                        <dd className="font-semibold text-foreground">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* Rating Summary */}
                <div className="glass-card grid gap-8 p-6 sm:grid-cols-2">
                  <div className="text-center">
                    <div className="font-display text-6xl font-bold text-foreground">{product.rating}</div>
                    <div className="mt-2 flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Based on {product.reviews.toLocaleString()} reviews</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = ratingBreakdown[star] || 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="w-3 text-muted-foreground">{star}</span>
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary/50">
                            <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {visibleReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {reviews.length > 2 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="mx-auto flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    {showAllReviews ? (
                      <><ChevronUp className="h-4 w-4" /> Show less</>
                    ) : (
                      <><ChevronDown className="h-4 w-4" /> Show all {reviews.length} reviews</>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

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

function ReviewCard({ review }: { review: ReviewData }) {
  const [helpful, setHelpful] = useState(false);

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={review.avatar} alt={review.author} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{review.author}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Check className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />
          ))}
        </div>
      </div>
      <h4 className="mt-3 text-sm font-semibold text-foreground">{review.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1.5 text-xs transition-colors ${helpful ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${helpful ? "fill-current" : ""}`} />
          Helpful ({review.helpful + (helpful ? 1 : 0)})
        </button>
      </div>
    </div>
  );
}
