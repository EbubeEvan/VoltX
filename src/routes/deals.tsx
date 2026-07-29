import { createFileRoute } from "@tanstack/react-router";
import { FlashDeals } from "@/components/FlashDeals";
import { getFlashDeals } from "@/lib/server/products";
import { toCardProducts } from "@/lib/mappers";
import { SkeletonGrid } from "@/components/PageSkeleton";

export const Route = createFileRoute("/deals")({
  loader: async () => {
    const deals = await getFlashDeals();
    return { deals: toCardProducts(deals) };
  },
  pendingComponent: SkeletonGrid,
  head: () => ({
    meta: [
      { title: "Hot Deals — VoltX Electronics" },
      {
        name: "description",
        content:
          "Limited-time flash deals on premium electronics. Don't miss these exclusive offers.",
      },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const { deals } = Route.useLoaderData();
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Hot Deals</h1>
        <p className="mt-2 text-muted-foreground">
          Don't miss these limited-time offers on premium electronics
        </p>
      </div>
      <FlashDeals products={deals} />
    </div>
  );
}
