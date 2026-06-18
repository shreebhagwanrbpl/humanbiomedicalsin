import { db } from "../lib/firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";

export default async function sitemap() {
    const baseUrl =
        "https://humanbiomedicals.in";

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
    const districtSnap =
        await getDocs(
            collection(
                db,
                "websites",
                "humanbiomedicalsin",
                "districts"
            )
        );

    const districts =
        districtSnap.docs.map(
            (doc) => doc.data()
        );

    districts.forEach((district) => {
        const slug =
            district.slug;

        urls.push(
            {
                url: `${baseUrl}/${slug}`,
                lastModified:
                    new Date(),
            },
            {
                url: `${baseUrl}/${slug}/about`,
                lastModified:
                    new Date(),
            },
            {
                url: `${baseUrl}/${slug}/services`,
                lastModified:
                    new Date(),
            },
            {
                url: `${baseUrl}/${slug}/contact`,
                lastModified:
                    new Date(),
            },
            {
                url: `${baseUrl}/${slug}/items`,
                lastModified:
                    new Date(),
            }
        );
    });

    // Products
    const productDoc =
        await getDoc(
            doc(
                db,
                "websites",
                "humanbiomedicalsin",
                "pages",
                "products"
            )
        );

    const products =
        productDoc.data()
            ?.products || [];

    products.forEach(
        (product) => {
            urls.push({
                url: `${baseUrl}/items/${product.slug}`,
                lastModified:
                    new Date(),
            });

            districts.forEach(
                (district) => {
                    urls.push({
                        url:
                            `${baseUrl}/${district.slug}/items/${product.slug}`,
                        lastModified:
                            new Date(),
                    });
                }
            );
        }
    );

    return urls;
}