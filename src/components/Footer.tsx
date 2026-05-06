import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {["Smartphones", "Laptops", "TVs", "Audio", "Gaming"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {["Contact Us", "FAQs", "Shipping", "Returns", "Warranty"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {["About", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              VOLT<span className="text-primary">X</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 VoltX Electronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
