import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$product"
      params={{ product: product.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
        />
      </div>
      <div className="flex-1 flex flex-col p-5">
        <span className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{product.shortDescription}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-smooth">
          View Details <ArrowRight className="h-4 w-4" />
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
