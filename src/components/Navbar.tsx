import { useState, useEffect } from "react";

import {
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/humanlogo.png";

export function Navbar() {

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {

    const onScroll = () =>
      setScrolled(
        window.scrollY > 8
      );

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );

  }, []);

  const pathParts =
    window.location.pathname
      .split("/")
      .filter(Boolean);

  // const district =
  //   pathParts.length > 0 &&
  //     ![
  //       "about",
  //       "items",
  //       "services",
  //       "blog",
  //       "contact",
  //       "quote",
  //     ].includes(pathParts[0])
  //     ? pathParts[0]
  //     : "";
  const reservedRoutes = [
    "about",
    "items",
    "products",
    "services",
    "blog",
    "contact",
    "quote",
  ];

  const district =
    pathParts.length > 0 &&
      !reservedRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";
  const prefix =
    district
      ? `/${district}`
      : "";

  const links = [
    {
      href: `${prefix}/`,
      label: "Home",
    },

    {
      href: `${prefix}/about`,
      label: "About",
    },

    {
      href: `${prefix}/items`,
      label: "Products",
    },

    {
      href: `${prefix}/services`,
      label: "Services",
    },

    {
      href: `${prefix}/blog`,
      label: "Blog",
    },

    {
      href: `${prefix}/contact`,
      label: "Contact",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${scrolled
        ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-soft"
        : "bg-background/60 backdrop-blur-md"
        }`}
    >

      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        {/* <a
          href={`${prefix}/`}
          className="flex items-center gap-2 font-bold text-lg"
        > */}
        <Link
          to={district ? "/$district" : "/"}
          params={
            district
              ? { district }
              : undefined
          }
          className="flex items-center gap-2 font-bold text-lg"
        >


          <div className="flex h-12 w-12 items-center justify-center rounded-lg shadow-soft overflow-hidden">

            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain"
            />

          </div>

          {/* </a> */}
        </Link>
        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1">

          {links.map((l) => (

            <li key={l.href}>

              <a
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-accent transition-smooth"
              >

                {l.label}

              </a>

            </li>

          ))}

        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-2">

          <Button
            asChild
            variant="ghost"
            size="sm"
          >

            <a
              href={`${prefix}/contact`}
            >

              Call Us

            </a>

          </Button>

          <Button
            asChild
            size="sm"
            className="bg-gradient-primary shadow-soft hover:shadow-glow transition-smooth"
          >

            <a
              href={`${prefix}/quote`}
            >

              Get Quote

            </a>

          </Button>

        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-md hover:bg-accent transition-smooth"
          onClick={() =>
            setOpen(!open)
          }
        >

          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}

        </button>

      </nav>

      {/* Mobile Menu */}
      {open && (

        <div className="lg:hidden border-t border-border bg-background animate-fade-up">

          <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">

            {links.map((l) => (

              <li key={l.href}>

                <a
                  href={l.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="block px-3 py-2.5 rounded-md text-foreground/80 hover:text-primary hover:bg-accent transition-smooth"
                >

                  {l.label}

                </a>

              </li>

            ))}

            <li className="mt-2">

              <Button
                asChild
                className="w-full bg-gradient-primary"
              >

                <a
                  href={`${prefix}/quote`}
                  onClick={() =>
                    setOpen(false)
                  }
                >

                  Get Quote

                </a>

              </Button>

            </li>

          </ul>

        </div>

      )}

    </header>
  );
}