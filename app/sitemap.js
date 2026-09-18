import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchFullCatalog } from "../lib/db-server";

export const revalidate = 3600;

export default async function sitemap() {
    const baseUrl = "https://humanbiomedicals.in";
    const urls = [];

    // Static pages
    urls.push(
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/items`,
            lastModified: new Date(),
        }
    );

    // Districts
    try {
        const districtSnap = await getDocs(
            collection(db, "websites", "humanbiomedicalsin", "districts")
        );

        const districts = districtSnap.docs.map((doc) => doc.data());

        districts.forEach((district) => {
            const slug = district.slug;
            if (!slug) return;

            urls.push(
                {
                    url: `${baseUrl}/${slug}`,
                    lastModified: new Date(),
                },
                {
                    url: `${baseUrl}/${slug}/about`,
                    lastModified: new Date(),
                },
                {
                    url: `${baseUrl}/${slug}/services`,
                    lastModified: new Date(),
                },
                {
                    url: `${baseUrl}/${slug}/contact`,
                    lastModified: new Date(),
                },
                {
                    url: `${baseUrl}/${slug}/items`,
                    lastModified: new Date(),
                }
            );
        });

        // Products from Master Catalog and Website Documents
        const catalogData = await fetchFullCatalog();
        const products = catalogData.categoryProducts || [];

        products.forEach((product) => {
            if (!product.slug) return;

            urls.push({
                url: `${baseUrl}/items/${product.slug}`,
                lastModified: new Date(),
            });

            districts.forEach((district) => {
                if (!district.slug) return;
                urls.push({
                    url: `${baseUrl}/${district.slug}/items/${product.slug}`,
                    lastModified: new Date(),
                });
            });
        });
    } catch (err) {
        console.error("Error generating sitemap:", err);
    }

    return urls;
}