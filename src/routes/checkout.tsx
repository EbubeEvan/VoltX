import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — VoltX" },
      { name: "description", content: "Complete your purchase at VoltX Electronics." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added any items yet.</p>
          <Link to="/products">
            <Button variant="hero" size="lg" className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 99 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Checkout</h1>
      <p className="mt-1 text-muted-foreground">{totalItems} items in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex gap-4 p-4"
            >
              <Link to="/products/$productId" params={{ productId: product.id }} className="shrink-0">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-contain bg-secondary/30 p-2" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
                  <Link to="/products/$productId" params={{ productId: product.id }}>
                    <h3 className="font-semibold text-foreground hover:text-primary">{product.name}</h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-foreground">${(product.price * quantity).toLocaleString()}</span>
                    <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-card h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-success font-medium" : "text-foreground"}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estimated Tax</span><span className="text-foreground">${tax.toFixed(2)}</span></div>
          </div>
          <div className="border-t border-border/50 pt-4">
            <div className="flex justify-between">
              <span className="font-display text-lg font-bold text-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <Button variant="hero" size="xl" className="w-full" onClick={() => { clearCart(); alert("Order placed! (Demo)"); }}>
            <Lock className="mr-2 h-4 w-4" /> Place Order
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" />Secure checkout powered by VoltX
          </p>
        </div>
      </div>
    </div>
  );
}
