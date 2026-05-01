import { Link } from "@tanstack/react-router";
import {Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { categories } from "@/data/products";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-24">
      <div className="container mx-auto px-4 md:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
            <div className="flex h-17 w-17 items-center justify-center rounded-lg  shadow-soft overflow-hidden">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-contain"
          />
              </div>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">{site.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/services", label: "Services" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
              { to: "/quote", label: "Get Quote" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-primary transition-smooth">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/products/category/$category"
                  params={{ category: c.slug }}
                  className="text-muted-foreground hover:text-primary transition-smooth">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" />{site.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" />{site.email}</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" />{site.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-smooth">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
