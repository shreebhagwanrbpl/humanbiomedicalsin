import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

import {
  getProductsByCategory,
} from "@/data/products";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/products/category/$category")({

  loader: async ({ params }) => {

    const snap = await getDoc(
      doc(db, "websites", "humanbiomedicalsin", "pages", "products")
    );

    const allProducts = snap.exists()
      ? snap.data().products || []
      : [];

    const publishedProducts =
      allProducts.filter(
        (p: any) => p.isPublished
      );

    const items =
      getProductsByCategory(
        publishedProducts,
        params.category
      );

    if (items.length === 0)
      throw notFound();

    return {
      category: params.category,

      items,
    };
  },

  head: ({ loaderData }: any) => ({

    meta: loaderData
      ? [
        {
          title:
            `${loaderData.category} | Human Biomedicals`,
        },

        {
          name: "description",

          content:
            `${loaderData.category} products from Human Biomedicals.`,
        },

        {
          property: "og:title",

          content:
            `${loaderData.category} | Human Biomedicals`,
        },

        {
          property: "og:description",

          content:
            `${loaderData.category} products from Human Biomedicals.`,
        },
      ]
      : [],
  }),

  notFoundComponent: () => (

    <SiteLayout>

      <div className="container mx-auto px-4 py-24 text-center">

        <h1 className="text-3xl font-bold mb-4">
          Category not found
        </h1>

        <Button asChild>

          <Link to="/products">
            Back to Products
          </Link>

        </Button>

      </div>

    </SiteLayout>
  ),

  errorComponent: ({ error }) => (

    <SiteLayout>

      <div className="container mx-auto px-4 py-24 text-center">

        <h1 className="text-3xl font-bold mb-2">
          Something went wrong
        </h1>

        <p className="text-muted-foreground">
          {error.message}
        </p>

      </div>

    </SiteLayout>
  ),

  component: CategoryPage,
});

function CategoryPage({
  district,
}: {
  district?: string;
}) {

  const {
    category,
    items,
  }: any = Route.useLoaderData();

  return (
    <SiteLayout>

      <PageHero
        eyebrow="Category"

        title={category}

        description={`${category} products from Human Biomedicals`}
      />

      <section className="container mx-auto px-4 md:px-6 py-12">

        {items.length === 0 ? (

          <p className="text-center text-muted-foreground py-16">

            No products in this category yet.

          </p>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((p: any) => (

              <ProductCard
                key={p.id}
                product={p}
                district={district}
              />

            ))}

          </div>

        )}

        <div className="mt-12 text-center">

          <Button asChild variant="outline">

            <Link to="/products">
              View All Categories
            </Link>

          </Button>

        </div>

      </section>

    </SiteLayout>
  );
}