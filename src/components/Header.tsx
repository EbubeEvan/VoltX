import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Heart, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { authClient } from "@/lib/auth-client";
import { serverSignOut } from "@/lib/server/auth-actions";

export function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { totalItems, clearCart } = useCart();
  const { wishlist, clearWishlist } = useWishlist();
  const { data: session, isPending, refetch } = authClient.useSession();

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  function handleSearch() {
    const q = searchQuery.trim();
    if (q) {
      navigate({ to: "/products", search: { search: q } });
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  async function handleLogout() {
    clearCart();
    clearWishlist();
    await serverSignOut();
    await authClient.signOut();
    document.cookie.split(";").forEach((c) => {
      const trimmed = c.trim();
      if (trimmed.startsWith("voltx.") || trimmed.startsWith("voltx-")) {
        const name = trimmed.includes("=") ? trimmed.split("=")[0].trim() : trimmed;
        document.cookie = `${name}=; path=/; max-age=0;`;
      }
    });
    refetch();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">V</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            VOLT<span className="text-primary">X</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Home", to: "/" as const },
            { label: "Products", to: "/products" as const },
            { label: "Deals", to: "/deals" as const },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-sm font-medium text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="h-9 w-48 rounded-lg border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button variant="ghost" size="icon" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
              <Heart className="h-4 w-4" />
              {wishlist.size > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-primary-foreground">
                  {wishlist.size}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {!isPending && (
            <>
              {session ? (
                <>
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {[
              { label: "Home", to: "/" as const },
              { label: "Products", to: "/products" as const },
              { label: "Deals", to: "/deals" as const },
              ...(session
                ? [{ label: "Profile", to: "/profile" as const }]
                : [{ label: "Sign In", to: "/login" as const }]),
              { label: "Wishlist", to: "/wishlist" as const },
              { label: "Cart", to: "/cart" as const },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
