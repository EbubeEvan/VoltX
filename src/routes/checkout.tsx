import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Truck, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { getCheckoutSession } from "@/lib/server/profile";
import { createOrder } from "@/lib/server/orders";
import { SkeletonCheckout } from "@/components/PageSkeleton";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  paymentMethod: z.enum(["paystack", "pay_on_delivery"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const Route = createFileRoute("/checkout")({
  loader: async () => {
    try {
      const user = await getCheckoutSession();
      return { user };
    } catch {
      return { user: null };
    }
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
  const { items, totalPrice, totalItems, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      paymentMethod: "paystack",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <CreditCard className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            No items to checkout
          </h1>
          <p className="mt-2 text-muted-foreground">Add some items to your cart first.</p>
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

  const onSubmit = async (values: CheckoutFormValues) => {
    const ref = `VOLT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const orderData = {
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
      paymentMethod: values.paymentMethod,
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
    };

    if (values.paymentMethod === "paystack") {
      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      if (!paystackKey) {
        toast.error(
          "Paystack is not configured. Set VITE_PAYSTACK_PUBLIC_KEY in your environment.",
        );
        return;
      }

      type PaystackPopWindow = {
        PaystackPop: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } };
      };
      const handler = (window as unknown as PaystackPopWindow).PaystackPop?.setup({
        key: paystackKey,
        email: values.email,
        amount: Math.round(orderTotal * 100),
        currency: "NGN",
        ref,
        onClose: () => {
          toast("Payment cancelled", { icon: "🛒" });
        },
        callback: () => {
          createOrder({ data: orderData })
            .then(() => {
              clearCart();
              toast.success("Payment successful! Order placed.");
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
    } else {
      try {
        await createOrder({ data: orderData });
        clearCart();
        toast.success("Order placed! Pay on delivery selected.");
        navigate({ to: "/profile" });
      } catch {
        toast.error("Order creation failed. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Checkout</h1>
      <p className="mt-1 text-muted-foreground">{totalItems} items to purchase</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Billing Address & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Billing Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card space-y-4 p-4 sm:p-6"
            >
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">
                Billing Address
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="08012345678" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Apt 4B"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Lagos" {...register("city")} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Lagos State" {...register("state")} />
                  {errors.state && (
                    <p className="text-xs text-destructive">{errors.state.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" placeholder="100001" {...register("postalCode")} />
                  {errors.postalCode && (
                    <p className="text-xs text-destructive">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card space-y-4 p-4 sm:p-6"
            >
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">
                Payment Method
              </h2>
              <RadioGroup
                defaultValue="paystack"
                className="space-y-3"
                onValueChange={(v) => {
                  setValue("paymentMethod", v as "paystack" | "pay_on_delivery");
                }}
              >
                <Label
                  htmlFor="paystack"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    paymentMethod === "paystack"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="paystack" id="paystack" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Pay with Paystack</p>
                    <p className="text-xs text-muted-foreground whitespace-normal">
                      Secure online payment via card, bank transfer, or USSD
                    </p>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </Label>
                <Label
                  htmlFor="pay_on_delivery"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    paymentMethod === "pay_on_delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Pay on Delivery</p>
                    <p className="text-xs text-muted-foreground whitespace-normal">
                      Pay when your order arrives at your doorstep
                    </p>
                  </div>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </Label>
              </RadioGroup>
              <input type="hidden" {...register("paymentMethod")} />
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card h-fit space-y-4 p-4 sm:p-6"
          >
            <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">
              Order Summary
            </h2>
            <div className="max-h-48 space-y-3 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded bg-secondary/30 object-contain p-1"
                    />
                    <div className="overflow-hidden">
                      <p className="truncate font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-medium text-foreground">
                    ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border/50 pt-4 text-sm">
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
                <span className="text-muted-foreground">Tax</span>
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
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Processing..."
              ) : paymentMethod === "paystack" ? (
                <span className="text-sm sm:text-base">
                  <Lock className="mr-2 inline h-4 w-4" /> Pay with Paystack
                </span>
              ) : (
                <span className="text-sm sm:text-base">
                  <Truck className="mr-2 inline h-4 w-4" /> Place Order (Pay on Delivery)
                </span>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Lock className="mr-1 inline h-3 w-3" />
              {paymentMethod === "paystack" ? "Secured by Paystack" : "Cash on delivery"}
            </p>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
