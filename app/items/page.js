import "./Products.css";
import ProductsClient from "./ProductsClient";
import { fetchFullCatalog } from "@/lib/db-server";

export const revalidate = 3600;

export async function generateMetadata() {
  const url = "https://humanbiomedicals.in/items";
  return {
    title: "Biomedical Equipment Catalog | Hematology & Biochemistry Analyzers | Human Biomedicals",
    description: "Explore advanced 3-Part & 5-Part hematology analyzers, biochemistry systems, electrolyte analyzers, and pathology equipment supplied across India.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Biomedical Equipment Catalog | Human Biomedicals",
      description: "Premier supplier of laboratory analyzers, medical equipment, and diagnostic consumables across India.",
      url,
      type: "website",
    },
  };
}

export default async function ItemsPage({ district = "" }) {
  // Fetch products and categories from Master Catalog and website documents
  const data = await fetchFullCatalog();

  const city = district
    ? district
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <ProductsClient
      initialCategories={data.categoryList}
      initialProducts={data.categoryProducts}
      city={city}
      district={district}
    />
  );
}