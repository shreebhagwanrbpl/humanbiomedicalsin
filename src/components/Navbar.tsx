import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
       <div className="flex h-17 w-17 items-center justify-center rounded-lg  shadow-soft overflow-hidden">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-accent transition-smooth"
                activeProps={{ className: "text-primary bg-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/contact">Call Us</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-primary shadow-soft hover:shadow-glow transition-smooth">
            <Link to="/quote">Get Quote</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-md hover:bg-accent transition-smooth"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-foreground/80 hover:text-primary hover:bg-accent transition-smooth"
                  activeProps={{ className: "text-primary bg-accent" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Button asChild className="w-full bg-gradient-primary">
                <Link to="/quote" onClick={() => setOpen(false)}>Get Quote</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
