import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { categories, products, type CategorySlug } from "@/data/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Lab Equipment, Reagents & Consumables | Rajbiosis" },
      { name: "description", content: "Browse our complete catalog of hematology analyzers, biochemistry analyzers, reagents, test kits, controls and lab consumables." },
      { property: "og:title", content: "Rajbiosis Products Catalog" },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const [active, setActive] = useState<"all" | CategorySlug>("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <SiteLayout>
      <PageHero eyebrow="Catalog" title="Our Products" description="Lab equipment, reagents, kits and consumables — engineered for accuracy and built to last." />
      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <FilterChip active={active === "all"} onClick={() => setActive("all")}>All</FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>
              {c.name}
            </FilterChip>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Don't see what you need? We supply 150+ products.</p>
          <Button asChild className="bg-gradient-primary"><Link to="/quote">Request Custom Quote</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-smooth ${
        active
          ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
          : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
