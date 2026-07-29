import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { FlashDeals } from "@/components/FlashDeals";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { NewArrivals } from "@/components/NewArrivals";
import { TrustBar } from "@/components/TrustBar";
import { Newsletter } from "@/components/Newsletter";
import { getHomePageData } from "@/lib/server/products";
import { toCardProducts } from "@/lib/mappers";
import { SkeletonHome } from "@/components/PageSkeleton";

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await getHomePageData();
    return {
      featured: toCardProducts(data.featured),
      newArrivals: toCardProducts(data.arrivals),
      flashDeals: toCardProducts(data.deals),
    };
  },
  pendingComponent: SkeletonHome,
  head: () => ({
    meta: [
      { title: "VoltX — Next-Gen Electronics, Delivered" },
      {
        name: "description",
        content:
          "Premium smartphones, laptops, TVs, audio gear and gaming accessories at unbeatable prices. Free shipping on orders over ₦99,000.",
      },
      { property: "og:title", content: "VoltX — Next-Gen Electronics, Delivered" },
      {
        property: "og:description",
        content:
          "Premium smartphones, laptops, TVs, audio gear and gaming accessories at unbeatable prices.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { featured, newArrivals, flashDeals } = Route.useLoaderData();

  return (
    <>
      <HeroSection />
      <CategoryNav />
      <FlashDeals products={flashDeals} />
      <FeaturedProducts products={featured} />
      <NewArrivals products={newArrivals} />
      <TrustBar />
      <Newsletter />
    </>
  );
}
