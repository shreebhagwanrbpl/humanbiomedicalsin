import {
    createFileRoute,
    notFound,
} from "@tanstack/react-router";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import QuotePage from "@/routes/quote";

export const Route =
    createFileRoute(
        "/$district/quote"
    )({

        validateSearch: (
            search: Record<string, unknown>
        ) => ({
            product:
                typeof search.product === "string"
                    ? search.product
                    : "",
        }),

        beforeLoad: async ({
            params,
        }) => {

            const slug =
                params.district?.toLowerCase();

            const snap =
                await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "districts",
                        slug
                    )
                );

            if (!snap.exists()) {

                throw notFound();

            }

        },

        component:
            DistrictQuotePage,

    });

function DistrictQuotePage() {

    const { district } =
        Route.useParams();

    const { product } =
        Route.useSearch();

    return (
        <QuotePage
            district={district}
            product={product}
        />
    );
}

export default DistrictQuotePage;