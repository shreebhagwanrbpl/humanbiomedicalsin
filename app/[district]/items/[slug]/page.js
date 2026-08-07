import ProductDetails from "../../../items/[slug]/ProductDetails";
import { getProductBySlug } from "../../../../lib/db-server";
import { cache } from "react";
import { notFound } from "next/navigation";

// Request-scoped cache to deduplicate data fetching during SSR
const getProductCached = cache(async (slug) => {
    return getProductBySlug(slug);
});

export async function generateMetadata({ params }) {
    const { slug, district } = await params;
    const product = await getProductCached(slug);

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";

    if (!product) {
        return {
            title: "Product Not Found | Human Biomedicals",
            description: "The requested biomedical product could not be found.",
        };
    }

    const title = `${product.title} Supplier in ${city} | Human Biomedicals`;
    const description = `Buy ${product.title} from Human Biomedicals in ${city}. Trusted supplier of biomedical equipment, laboratory instruments and healthcare solutions.`;
    const url = `https://humanbiomedicals.in/${district}/items/${slug}`;

    return {
        title,
        description,
        keywords: [
            product.title,
            `${product.title} Supplier in ${city}`,
            `${product.title} Dealer in ${city}`,
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

export default async function DistrictProductPage({ params }) {
    const { slug, district } = await params;
    const product = await getProductCached(slug);

    if (!product) {
        notFound();
    }

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";

    return (
        <ProductDetails
            initialProduct={product}
            district={district}
            city={city}
        />
    );
}
export const revalidate = 3600;