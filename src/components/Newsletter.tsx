import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/server/newsletter";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: NewsletterFormValues) {
    setIsSubmitting(true);
    try {
      const result = await subscribeNewsletter({ data: values });
      if (result?.success) {
        toast.success("You've been subscribed! Check your inbox.");
        form.reset();
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="glass-card relative overflow-hidden px-6 py-14 text-center sm:px-12">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[oklch(0.65_0.2_280/10%)] blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Get 10% Off Your First Order
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Subscribe to our newsletter for exclusive deals, new arrivals, and tech insights.
          </p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-8 flex max-w-md gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-lg border border-input bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              {...form.register("email")}
            />
            <Button variant="hero" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          {form.formState.errors.email && (
            <p className="mx-auto mt-2 max-w-md text-left text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
