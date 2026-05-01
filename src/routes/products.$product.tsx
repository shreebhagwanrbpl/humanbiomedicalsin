import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/products/$product")({
  loader: ({ params }) => {
    const p = getProduct(params.product);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} | Rajbiosis` },
          { name: "description", content: loaderData.product.shortDescription },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.shortDescription },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
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
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const related = getProductsByCategory(product.category).filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 md:px-6 pt-10 pb-6">
        <nav className="text-sm text-muted-foreground mb-6 flex gap-2 items-center">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link to="/products/category/$category" params={{ category: product.category }} className="hover:text-primary capitalize">{product.category}</Link>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="rounded-2xl overflow-hidden bg-muted shadow-elegant aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[product.image, product.image, product.image].map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                  <img src={src} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 leading-tight">{product.name}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">Key Features</h2>
            <ul className="space-y-2 mb-8">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary shadow-soft">
                <Link to="/quote">Enquire Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {product.specs.map((s, i) => (
                <tr key={s.label} className={i % 2 === 0 ? "bg-muted/40" : "bg-card"}>
                  <td className="px-5 py-4 font-medium w-1/3">{s.label}</td>
                  <td className="px-5 py-4 text-muted-foreground">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
