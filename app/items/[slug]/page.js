import ProductDetails from "./ProductDetails";
import { getProductBySlug, fetchFullCatalog } from "@/lib/db-server";
import { notFound } from "next/navigation";

// Pre-render product pages at build time across master catalog and categories
export async function generateStaticParams() {
    try {
        const data = await fetchFullCatalog();
        return (data.categoryProducts || []).map((p) => ({
            slug: p.slug,
        }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

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

    const title = `${product.title} Supplier in India | Human Biomedicals`;
    const description = `${product.title} from Human Biomedicals. ${product.desc || "Trusted supplier of biomedical, pathology and laboratory equipment."}`;
    const url = `https://humanbiomedicals.in/items/${slug}`;

    return {
        title,
        description,
        keywords: [
            product.title,
            product.brand,
            product.model,
            `${product.title} Supplier`,
            `${product.title} Dealer`,
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

export default async function Page({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <ProductDetails
            initialProduct={product}
            district=""
            city="India"
        />
    );
}

export const revalidate = 3600;