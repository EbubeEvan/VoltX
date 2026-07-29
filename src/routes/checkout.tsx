import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getCheckoutSession } from "@/lib/server/profile";
import { createOrder } from "@/lib/server/orders";
import { SkeletonCheckout } from "@/components/PageSkeleton";

export const Route = createFileRoute("/checkout")({
  loader: async () => {
    const user = await getCheckoutSession();
    return { user };
  },
  pendingComponent: SkeletonCheckout,
  head: () => ({
    meta: [
      { title: "Checkout — VoltX" },
      { name: "description", content: "Complete your purchase at VoltX Electronics." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = Route.useLoaderData();
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added any items yet.</p>
          <Link to="/products">
            <Button variant="hero" size="lg" className="mt-6">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingThreshold = 99000;
  const shipping = totalPrice >= shippingThreshold ? 0 : 5000;
  const taxRate = 0.01;
  const tax = Math.round(totalPrice * taxRate);
  const orderTotal = totalPrice + shipping + tax;

  const handlePaystack = () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
      return;
    }
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      toast.error("Paystack is not configured. Set VITE_PAYSTACK_PUBLIC_KEY in your environment.");
      return;
    }

    const ref = `VOLT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    type PaystackPopWindow = {
      PaystackPop: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } };
    };
    const handler = (window as unknown as PaystackPopWindow).PaystackPop?.setup({
      key: paystackKey,
      email: user?.email || "guest@example.com",
      amount: Math.round(orderTotal * 100),
      currency: "NGN",
      ref,
      onClose: () => {
        toast("Payment cancelled", { icon: "🛒" });
      },
      callback: () => {
        createOrder({
          data: {
            items: items.map((i) => ({
              productId: Number(i.product.id),
              productName: i.product.name,
              quantity: i.quantity,
              unitPrice: i.product.price,
            })),
            shipping,
            tax,
            total: orderTotal,
            reference: ref,
          },
        })
          .then(() => {
            clearCart();
            toast.success("Payment successful!");
            navigate({ to: "/profile" });
          })
          .catch(() => {
            toast.error("Order creation failed. Please contact support.");
          });
      },
    });

    if (!handler) {
      toast.error("Payment system failed to load. Please refresh and try again.");
      return;
    }

    handler.openIframe();
  };

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
              <Link
                to="/products/$productId"
                params={{ productId: product.id }}
                className="shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 rounded-lg object-contain bg-secondary/30 p-2"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </p>
                  <Link to="/products/$productId" params={{ productId: product.id }}>
                    <h3 className="font-semibold text-foreground hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-foreground">
                      ₦{(product.price * quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? "text-success font-medium" : "text-foreground"}>
                {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Tax</span>
              <span className="text-foreground">₦{tax.toLocaleString()}</span>
            </div>
          </div>
          <div className="border-t border-border/50 pt-4">
            <div className="flex justify-between">
              <span className="font-display text-lg font-bold text-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">
                ₦{orderTotal.toLocaleString()}
              </span>
            </div>
          </div>
          <Button variant="hero" size="xl" className="w-full" onClick={handlePaystack}>
            <Lock className="mr-2 h-4 w-4" /> Pay with Paystack
          </Button>
          {!user && (
            <p className="text-center text-xs text-muted-foreground">
              You'll be able to log in or continue as guest
            </p>
          )}
          <p className="text-center text-xs text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" />
            Secured by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}
