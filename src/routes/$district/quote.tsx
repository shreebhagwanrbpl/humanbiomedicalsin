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

        beforeLoad: async ({
            params,
        }) => {

            const slug =
                params.district
                    ?.toLowerCase();

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

            if (
                !snap.exists()
            ) {

                throw notFound();

            }

        },

        component:
            DistrictQuotePage,

    });

function DistrictQuotePage() {

    const { district } =
        Route.useParams();

    return (
        <QuotePage
            district={district}
            city={district}
        />
    );
}