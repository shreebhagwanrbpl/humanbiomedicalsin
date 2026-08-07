import ProductDetails from "./ProductDetails";
import { getProductBySlug, getProductsData, getCategoriesData } from "../../../lib/db-server";
import { cache } from "react";
import { notFound } from "next/navigation";

// Pre-render product pages at build time
export async function generateStaticParams() {
    const otherProducts = await getProductsData();
    return otherProducts.map((p) => ({
        slug: p.slug,
    }));
}

// Request-scoped cache to deduplicate data fetching during SSR
const getProductCached = cache(async (slug) => {
    return getProductBySlug(slug);
});

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductCached(slug);

    if (!product) {
        return {
            title: "Product Not Found | Human Biomedicals",
            description: "The requested biomedical product could not be found.",
        };
    }

    const title = `${product.title} Supplier in India | Human Biomedicals`;
    const description = `${product.title} from Human Biomedicals. ${product.desc || "Trusted supplier of biomedical equipment."}`;
    const url = `https://humanbiomedicals.in/items/${slug}`;

    return {
        title,
        description,
        keywords: [
            product.title,
            `${product.title} Supplier`,
            `${product.title} Dealer`,
            `${product.title} Price`,
            "Biomedical Equipment",
            "Laboratory Equipment",
            "Medical Equipment Supplier",
            "Human Biomedicals",
        ],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Human Biomedicals",
            locale: "en_IN",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const product = await getProductCached(slug);

    if (!product) {
        notFound();
    }

    return (
        <ProductDetails
            initialProduct={product}
            district=""
            city=""
        />
    );
}
export const revalidate = 3600;