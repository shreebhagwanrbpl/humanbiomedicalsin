import ProductDetails from "./ProductDetails";

export async function generateMetadata({
    params,
}) {
    const slug = params?.slug || "";

    const productName =
        slug
            ?.replace(/-/g, " ")
            ?.replace(
                /\b\w/g,
                (c) =>
                    c.toUpperCase()
            );

    const title =
        `${productName} Supplier in India | Human Biomedicals`;

    const description =
        `Buy ${productName} from Human Biomedicals. Trusted supplier of biomedical equipment, laboratory instruments and healthcare solutions across India.`;

    const url =
        `https://humanbiomedicals.in/items/${slug}`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Dealer`,
            `${productName} Price`,
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
            siteName:
                "Human Biomedicals",
            locale: "en_IN",
            type: "website",
        },

        twitter: {
            card:
                "summary_large_image",
            title,
            description,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function Page() {
    return (
        <ProductDetails />
    );
}