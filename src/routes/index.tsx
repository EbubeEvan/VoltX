import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { FlashDeals } from "@/components/FlashDeals";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { NewArrivals } from "@/components/NewArrivals";
import { TrustBar } from "@/components/TrustBar";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoltX — Next-Gen Electronics, Delivered" },
      { name: "description", content: "Premium smartphones, laptops, TVs, audio gear and gaming accessories at unbeatable prices. Free shipping on orders over $99." },
      { property: "og:title", content: "VoltX — Next-Gen Electronics, Delivered" },
      { property: "og:description", content: "Premium smartphones, laptops, TVs, audio gear and gaming accessories at unbeatable prices." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <CategoryNav />
      <FlashDeals />
      <FeaturedProducts />
      <NewArrivals />
      <TrustBar />
      <Newsletter />
    </>
  );
}
