import { Link } from "@tanstack/react-router";

import { ArrowRight } from "lucide-react";

import type { Product } from "@/data/products";

// export function ProductCard({
//   product,
//   district,
// }: {
//   product: Product;
//   district?: string;
// }) {
export function ProductCard({
  product,
  district,
  detailLink = false,
}: {
  product: Product;
  district?: string;
  detailLink?: boolean;
}) {
  console.log("PRODUCT DATA", product);
  console.log("TITLE", product.title);
  // console.log("SLUG", product.slug);
  console.log("ID", product.id);
  return (
    // <Link
    //   to={
    //     district
    //       ? "/$district/items"
    //       : "/items"
    //   }

    //   params={
    //     district
    //       ? {
    //         district,
    //         product: product.id,
    //       }
    //       : {
    //         product: product.id,
    //       }
    //   }
    <Link
      to={
        detailLink
          ? district
            ? "/$district/products/$product"
            : "/products/$product"
          : district
            ? "/$district/items"
            : "/items"
      }
      params={
        detailLink
          ? district
            ? {
              district,
              product: product.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, ""),
            }
            : {
              product: product.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, ""),
            }
          : district
            ? {
              district,
            }
            : {}
      }

      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
    >

      <div className="aspect-[4/3] overflow-hidden bg-muted">

        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
        />

      </div>

      <div className="flex-1 flex flex-col p-5">

        <span className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">

          {product.instrument}

        </span>

        <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2">

          Product: {product.title}

        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">

          Brand: {product.brand}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">

          Model: {product.model}
        </p>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-smooth">

          View Details

          <ArrowRight className="h-4 w-4" />

        </span>

      </div>

    </Link>
  );
}

export function ProductCardSkeleton() {

  return (
    <div className="rounded-2xl border border-border overflow-hidden">

      <div className="aspect-[4/3] skeleton" />

      <div className="p-5 space-y-3">

        <div className="h-3 w-20 skeleton rounded" />

        <div className="h-4 w-full skeleton rounded" />

        <div className="h-3 w-3/4 skeleton rounded" />

      </div>

    </div>
  );
}