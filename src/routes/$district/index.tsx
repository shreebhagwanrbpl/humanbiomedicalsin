import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

import HomePage from "@/routes/index";

import {
  isValidDistrict,
} from "@/lib/districts";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const Route =
  createFileRoute(
    "/$district/"
  )({

    loader: async () => {

      // HOME DATA
      const homeSnap = await getDoc(
        doc(
          db,
          "websites",
          "humanbiomedicalsin",
          "pages",
          "home"
        )
      );

      // PRODUCTS DATA
      const productSnap = await getDoc(
        doc(
          db,
          "websites",
          "humanbiomedicalsin",
          "pages",
          "products"
        )
      );

      const homeData =
        homeSnap.exists()
          ? homeSnap.data()
          : null;

      const allProducts =
        productSnap.exists()
          ? productSnap.data().products || []
          : [];

      const publishedProducts =
        allProducts.filter(
          (p: any) => p.isPublished
        );

      const categories = [
        ...new Set(
          publishedProducts.map(
            (p: any) =>
              p.instrument || "Other"
          )
        ),
      ].map((item: any) => ({
        slug: item.toLowerCase(),

        name: item,

        image: "",

        tagline: `${item} Products`,
      }));

      return {
        ...homeData,

        products: publishedProducts,

        categories,
      };
    },

    beforeLoad: async ({
      params,
    }) => {

      const valid =
        await isValidDistrict(
          params.district
        );

      if (!valid) {

        throw notFound();

      }
    },

    component:
      DistrictHomePage,
  });

function DistrictHomePage() {

  const { district } =
    Route.useParams();

  const data =
    Route.useLoaderData();

  return (
    <HomePage
      district={district}
      city={district}
      data={data}
    />
  );
}