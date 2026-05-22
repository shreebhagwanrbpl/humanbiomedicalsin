import { useState } from "react";

import {
  createFileRoute,
} from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";

import { PageHero } from "@/components/SectionHeader";

import { ProductCard } from "@/components/ProductCard";

import { Button } from "@/components/ui/button";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const Route =
  createFileRoute(
    "/products/"
  )({

    loader: async () => {

      const snap =
        await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsin",
            "pages",
            "products"
          )
        );

      const allProducts =
        snap.exists()
          ? snap.data().products || []
          : [];

      const publishedProducts =
        allProducts.filter(
          (p: any) =>
            p.isPublished
        );

      const categories = [
        ...new Set(
          publishedProducts.map(
            (p: any) =>
              p.instrument || "Other"
          )
        ),
      ].map((item: any) => ({
        slug:
          item.toLowerCase(),

        name: item,
      }));

      return {
        products:
          publishedProducts,

        categories,
      };
    },

    head: () => ({
      meta: [
        {
          title:
            "Products — Lab Equipment, Reagents & Consumables | Human Biomedicals",
        },

        {
          name: "description",

          content:
            "Browse our complete catalog of hematology analyzers, biochemistry analyzers, reagents, test kits, controls and lab consumables.",
        },

        {
          property: "og:title",

          content:
            "Human Biomedicals Products Catalog",
        },
      ],
    }),

    component:
      ProductsIndex,
  });

function ProductsIndex({
  district,
  city,
  data,
}: {
  district?: string;
  city?: string;
  data?: any;
}) {

  let routeData: any = {};

  try {

    routeData =
      data ||
      Route.useLoaderData();

  } catch {

    routeData = {
      products: [],
      categories: [],
    };

  }

  const categories =
    routeData?.categories || [];

  const [active, setActive] =
    useState("all");

  const filtered =
    active === "all"
      ? routeData?.products || []
      : (
        routeData?.products || []
      ).filter(
        (p: any) =>
          p.instrument
            ?.toLowerCase() ===
          active.toLowerCase()
      );

  const prefix =
    district
      ? `/${district}`
      : "";

  return (
    <SiteLayout
      district={district}
    >

      <PageHero
        eyebrow="Catalog"

        title="Our Products"

        description="Lab equipment, reagents, kits and consumables — engineered for accuracy and built to last."
      />

      <section className="container mx-auto px-4 md:px-6 py-12">

        <div className="flex flex-wrap gap-2 mb-10 justify-center">

          <FilterChip
            active={
              active === "all"
            }
            onClick={() =>
              setActive("all")
            }
          >

            All

          </FilterChip>

          {categories.map(
            (c: any) => (

              <FilterChip
                key={c.slug}

                active={
                  active ===
                  c.slug
                }

                onClick={() =>
                  setActive(
                    c.slug
                  )
                }
              >

                {c.name}

              </FilterChip>

            )
          )}

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map(
            (p: any) => (

              <ProductCard
                key={p.id}
                product={p}
              />

            )
          )}

        </div>

        {filtered.length === 0 && (

          <p className="text-center text-muted-foreground py-16">

            No products found.

          </p>

        )}

        <div className="mt-12 text-center">

          <p className="text-muted-foreground mb-4">

            Don't see what you need?
            We supply 150+ products.

          </p>

          <Button
            asChild
            className="bg-gradient-primary"
          >

            <a
              href={`${prefix}/quote`}
            >

              Request Custom Quote

            </a>

          </Button>

        </div>

      </section>

    </SiteLayout>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;

  onClick: () => void;

  children: React.ReactNode;
}) {

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-smooth ${active
        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
        : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
        }`}
    >

      {children}

    </button>
  );
}

export default ProductsIndex;