import ProductDetails from "@/app/items/[slug]/ProductDetails";
import { getProductBySlug } from "@/lib/db-server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { slug, district } = await params;
    const product = await getProductBySlug(slug);

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "India";

    if (!product) {
        return {
            title: "Product Not Found | Human Biomedicals",
            description: "The requested biomedical product could not be found.",
            robots: {
                index: false,
                follow: false,
            },
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
            product.brand,
            product.model,
            `${product.title} Supplier in ${city}`,
            `${product.title} Dealer in ${city}`,
            `${product.title} Price`,
            "Biomedical Equipment",
            "Laboratory Equipment",
            "Medical Equipment Supplier",
            "Human Biomedicals",
        ].filter(Boolean),
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
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.images?.[0] ? [product.images[0]] : [],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DistrictProductPage({ params }) {
    const { slug, district } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "India";

    return (
        <ProductDetails
            initialProduct={product}
            district={district}
            city={city}
        />
    );
}

export const revalidate = 3600;