import {
    createFileRoute,
} from "@tanstack/react-router";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import ProductsIndex from "@/routes/products.index";

export const Route =
    createFileRoute(
        "/items"
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

        component:
            ItemsPage,

    });

function ItemsPage() {

    const data =
        Route.useLoaderData();

    return (
        <ProductsIndex
            data={data}
        />
    );

}