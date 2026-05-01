import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getCategory, getProductsByCategory, type CategorySlug } from "@/data/products";

export const Route = createFileRoute("/products/category/$category")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} | Rajbiosis` },
          { name: "description", content: loaderData.category.description },
          { property: "og:title", content: loaderData.category.name },
          { property: "og:description", content: loaderData.category.description },
          { property: "og:image", content: loaderData.category.image },
          { name: "twitter:image", content: loaderData.category.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Button asChild><Link to="/products">Back to Products</Link></Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = getProductsByCategory(category.slug as CategorySlug);
  return (
    <SiteLayout>
      <PageHero eyebrow="Category" title={category.name} description={category.description} />
      <section className="container mx-auto px-4 md:px-6 py-12">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}
        <div className="mt-12 text-center">
          <Button asChild variant="outline"><Link to="/products">View All Categories</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
