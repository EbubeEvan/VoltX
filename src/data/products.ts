import type { Product } from "@/components/ProductCard";

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 2341,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: 'MacBook Pro 14" M3 Pro',
    brand: "Apple",
    price: 1999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 1205,
    badge: "New",
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    price: 298,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 3456,
  },
  {
    id: "4",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1099,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 1890,
    badge: "Hot Deal",
  },
  {
    id: "5",
    name: 'LG C3 65" OLED 4K Smart TV',
    brand: "LG",
    price: 1496,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 876,
  },
  {
    id: "6",
    name: "PS5 DualSense Controller",
    brand: "Sony",
    price: 59,
    originalPrice: 74,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 4321,
  },
];

export const newArrivals: Product[] = [
  {
    id: "7",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    price: 799,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 567,
    badge: "New",
  },
  {
    id: "8",
    name: "iPad Pro 12.9 M2 Chip",
    brand: "Apple",
    price: 1099,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 890,
    badge: "New",
  },
  {
    id: "9",
    name: "Bose QuietComfort 45",
    brand: "Bose",
    price: 279,
    originalPrice: 329,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 2130,
  },
  {
    id: "10",
    name: "DJI Mini 3 Pro Drone",
    brand: "DJI",
    price: 759,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 445,
    badge: "New",
  },
];

export const flashDeals: Product[] = [
  {
    id: "11",
    name: "AirPods Pro 2nd Gen",
    brand: "Apple",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 5670,
  },
  {
    id: "12",
    name: "Razer BlackWidow V4 Pro",
    brand: "Razer",
    price: 149,
    originalPrice: 229,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 1234,
    badge: "Flash Deal",
  },
  {
    id: "13",
    name: 'Samsung 49" Odyssey OLED G9',
    brand: "Samsung",
    price: 1299,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 432,
    badge: "Flash Deal",
  },
];

export const allProducts = [...featuredProducts, ...newArrivals, ...flashDeals];

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export interface ReviewData {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

export interface ProductDetail extends Product {
  description: string;
  specs: Record<string, string>;
  images: string[];
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
  highlights?: string[];
  customerReviews?: ReviewData[];
  ratingBreakdown?: Record<number, number>;
}

const defaultReviews: ReviewData[] = [
  {
    id: "r1",
    author: "Alex M.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    date: "2026-04-12",
    title: "Absolutely love it!",
    comment:
      "Best purchase I've made this year. The build quality is outstanding and performance exceeds expectations. Highly recommend to anyone looking for a premium experience.",
    verified: true,
    helpful: 42,
  },
  {
    id: "r2",
    author: "Sarah K.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    rating: 4,
    date: "2026-03-28",
    title: "Great product, minor nitpick",
    comment:
      "Really solid product overall. The design is sleek and it performs beautifully. Only giving 4 stars because the price is a bit steep, but you get what you pay for.",
    verified: true,
    helpful: 18,
  },
  {
    id: "r3",
    author: "James T.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    date: "2026-03-15",
    title: "Worth every penny",
    comment:
      "Upgraded from a 3-year-old model and the difference is night and day. The screen quality, speed, and battery life are all phenomenal.",
    verified: false,
    helpful: 31,
  },
];

const defaultRatingBreakdown = { 5: 65, 4: 22, 3: 8, 2: 3, 1: 2 };

const productDetails: Record<string, Omit<ProductDetail, keyof Product>> = {
  "1": {
    description:
      "The most powerful iPhone ever. Featuring a titanium design, the A17 Pro chip, and a 48MP camera system with 5x optical zoom. Capture stunning photos in any light with the advanced computational photography engine.",
    specs: {
      Display: '6.7" Super Retina XDR OLED',
      Chip: "A17 Pro",
      Storage: "256GB",
      Camera: "48MP + 12MP + 12MP",
      Battery: "Up to 29 hours video",
      "Water Resistance": "IP68 (6m for 30 min)",
      Connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
      Weight: "221g",
    },
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
    ],
    colors: [
      { name: "Natural Titanium", hex: "#87837E" },
      { name: "Blue Titanium", hex: "#3C4043" },
      { name: "White Titanium", hex: "#F5F5F0" },
      { name: "Black Titanium", hex: "#1D1D1F" },
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    highlights: [
      "A17 Pro chip — fastest mobile chip ever",
      "48MP main camera with 5x optical zoom",
      "Titanium design — lighter, more durable",
      "Action Button for instant access",
      "USB-C with USB 3 speeds",
    ],
    customerReviews: [
      {
        id: "r1",
        author: "Mike R.",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        rating: 5,
        date: "2026-04-20",
        title: "Best iPhone ever made",
        comment:
          "The titanium build feels incredible in hand. Camera system is unreal — the 5x zoom changed how I take photos. Battery easily lasts all day.",
        verified: true,
        helpful: 89,
      },
      {
        id: "r2",
        author: "Lisa C.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
        rating: 4,
        date: "2026-04-05",
        title: "Almost perfect",
        comment:
          "Incredible phone. Only wish the base storage was 256GB for the price. Otherwise, everything from display to performance is top-tier.",
        verified: true,
        helpful: 34,
      },
      {
        id: "r3",
        author: "David P.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        rating: 5,
        date: "2026-03-18",
        title: "Worth the upgrade",
        comment:
          "Came from iPhone 13 Pro — the speed difference is massive. ProMotion display is buttery smooth and the new Action Button is surprisingly useful.",
        verified: true,
        helpful: 56,
      },
    ],
    ratingBreakdown: { 5: 72, 4: 18, 3: 6, 2: 3, 1: 1 },
  },
  "2": {
    description:
      "Supercharged by the M3 Pro chip, the MacBook Pro delivers exceptional performance and battery life in a stunning Liquid Retina XDR display. Perfect for developers, creatives, and power users.",
    specs: {
      Display: '14.2" Liquid Retina XDR',
      Chip: "Apple M3 Pro",
      Memory: "18GB Unified",
      Storage: "512GB SSD",
      Battery: "Up to 17 hours",
      Ports: "3x Thunderbolt 4, HDMI, SD, MagSafe",
      Weight: "1.61 kg",
      OS: "macOS Sonoma",
    },
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
    ],
    colors: [
      { name: "Space Black", hex: "#1D1D1F" },
      { name: "Silver", hex: "#E3E4E5" },
    ],
    storageOptions: ["512GB", "1TB", "2TB"],
    highlights: [
      "M3 Pro chip with 12-core CPU",
      "Up to 17 hours battery life",
      "Liquid Retina XDR display",
      "1080p FaceTime HD camera",
      "Six-speaker sound system",
    ],
    customerReviews: [
      {
        id: "r1",
        author: "Chris W.",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        rating: 5,
        date: "2026-04-15",
        title: "Developer's dream machine",
        comment:
          "Compiles my entire project in seconds. The display is gorgeous for design work and battery lasts through my entire workday. Best laptop I've owned.",
        verified: true,
        helpful: 67,
      },
      {
        id: "r2",
        author: "Emma S.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
        rating: 5,
        date: "2026-03-22",
        title: "Perfect for creative work",
        comment:
          "Video editing in 4K is seamless. The color accuracy on this display is incredible for photo editing. Worth every penny.",
        verified: true,
        helpful: 45,
      },
    ],
    ratingBreakdown: { 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 },
  },
};

export function getProductDetail(id: string): ProductDetail | undefined {
  const product = getProductById(id);
  if (!product) return undefined;
  const details = productDetails[id] || {
    description: `Experience premium quality with the ${product.name}. Designed for performance and built to last. Every detail has been carefully crafted to deliver an exceptional user experience.`,
    specs: { Brand: product.brand, Rating: `${product.rating}/5`, Reviews: `${product.reviews}` },
    images: [product.image],
    highlights: [
      "Premium build quality",
      "Industry-leading performance",
      "Exceptional user experience",
    ],
    customerReviews: defaultReviews,
    ratingBreakdown: defaultRatingBreakdown,
  };
  return {
    ...product,
    ...details,
    customerReviews: details.customerReviews || defaultReviews,
    ratingBreakdown: details.ratingBreakdown || defaultRatingBreakdown,
  };
}
