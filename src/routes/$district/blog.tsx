import {
    createFileRoute,
    notFound,
} from "@tanstack/react-router";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import BlogIndex from "@/routes/blog.index";

export const Route =
    createFileRoute(
        "/$district/blog"
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

            if (!snap.exists()) {

                throw notFound();

            }

        },

        component:
            DistrictBlogPage,

    });

function DistrictBlogPage() {

    const { district } =
        Route.useParams();

    return (
        <BlogIndex
            district={district}
        />
    );
}