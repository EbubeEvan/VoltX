import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Product } from "@/components/ProductCard";
import { authClient } from "@/lib/auth-client";
import {
  getCart as getServerCart,
  addToCart as addToServerCart,
  removeFromCart as removeFromServerCart,
  updateCartQuantity as updateServerCartQuantity,
  mergeCart as mergeServerCart,
} from "@/lib/server/cart";

const STORAGE_KEY = "voltx_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

type ServerCartItem = Awaited<ReturnType<typeof getServerCart>>[number];

function toCartItem(si: ServerCartItem): CartItem {
  return {
    product: {
      id: String(si.product.id),
      name: si.product.name,
      brand: si.product.brand,
      price: si.product.price / 100,
      originalPrice: si.product.originalPrice ? si.product.originalPrice / 100 : undefined,
      image: si.product.image,
      rating: si.product.rating ?? 0,
      reviews: si.product.reviews ?? 0,
      badge: si.product.badge ?? undefined,
      inStock: si.product.inStock ?? true,
    },
    quantity: si.quantity,
  };
}

function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [];
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const mergedForUser = useRef<string | null>(null);

  useEffect(() => {
    setItems(loadFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveToStorage(items);
  }, [items, ready]);

  useEffect(() => {
    if (!ready || isPending) return;
    const uid = session?.user?.id ?? null;

    if (uid) {
      if (mergedForUser.current !== uid) {
        const wasLoggedIn = mergedForUser.current !== null;
        mergedForUser.current = uid;
        const fromServer = () => getServerCart().then((res) => setItems(res.map(toCartItem)));
        if (wasLoggedIn) {
          fromServer();
        } else {
          const local = loadFromStorage();
          if (local.length > 0) {
            mergeServerCart({
              data: {
                items: local.map((i) => ({
                  productId: Number(i.product.id),
                  quantity: i.quantity,
                })),
              },
            }).then(fromServer);
          } else {
            fromServer();
          }
        }
      }
    } else if (mergedForUser.current !== null) {
      mergedForUser.current = null;
      setItems(loadFromStorage());
    }
  }, [session, ready, isPending]);

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const next = existing
          ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { product, quantity: 1 }];
        saveToStorage(next);
        return next;
      });
      if (session?.user?.id) {
        addToServerCart({ data: { productId: Number(product.id), quantity: 1 } });
      }
    },
    [session],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.product.id !== productId);
        saveToStorage(next);
        return next;
      });
      if (session?.user?.id) {
        removeFromServerCart({ data: { productId: Number(productId) } });
      }
    },
    [session],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((i) => i.product.id !== productId)
            : prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
        saveToStorage(next);
        return next;
      });
      if (session?.user?.id) {
        updateServerCartQuantity({ data: { productId: Number(productId), quantity } });
      }
    },
    [session],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
