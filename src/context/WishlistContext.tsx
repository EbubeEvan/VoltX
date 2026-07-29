import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import {
  getWishlist as getServerWishlist,
  addToWishlist as addToServerWishlist,
  removeFromWishlist as removeFromServerWishlist,
  mergeWishlist as mergeServerWishlist,
} from "@/lib/server/wishlist";

const STORAGE_KEY = "voltx_wishlist";

interface WishlistContextType {
  wishlist: Set<string>;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function loadFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const mergedForUser = useRef<string | null>(null);

  useEffect(() => {
    setIds(loadFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveToStorage(ids);
  }, [ids, ready]);

  useEffect(() => {
    if (!ready || isPending) return;
    const uid = session?.user?.id ?? null;

    if (uid) {
      if (mergedForUser.current !== uid) {
        const wasLoggedIn = mergedForUser.current !== null;
        mergedForUser.current = uid;
        const fromServer = () =>
          getServerWishlist().then((res) => setIds(res.map((r) => String(r.product.id))));
        if (wasLoggedIn) {
          fromServer();
        } else {
          const local = loadFromStorage();
          if (local.length > 0) {
            mergeServerWishlist({
              data: { productIds: local.map(Number) },
            }).then(fromServer);
          } else {
            fromServer();
          }
        }
      }
    } else if (mergedForUser.current !== null) {
      mergedForUser.current = null;
      setIds(loadFromStorage());
    }
  }, [session, ready, isPending]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        saveToStorage(next);
        return next;
      });
      if (session?.user?.id) {
        if (ids.includes(productId)) {
          removeFromServerWishlist({ data: { productId: Number(productId) } });
        } else {
          addToServerWishlist({ data: { productId: Number(productId) } });
        }
      }
    },
    [session, ids],
  );

  const isWishlisted = useCallback((productId: string) => ids.includes(productId), [ids]);

  const clearWishlist = useCallback(() => {
    setIds([]);
    saveToStorage([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist: new Set(ids),
        toggleWishlist,
        isWishlisted,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
