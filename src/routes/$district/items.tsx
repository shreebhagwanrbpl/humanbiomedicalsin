import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

// import SEO from "@/components/site/SEO";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import ProductsIndex from "@/routes/products.index";

export const Route =
  createFileRoute(
    "/$district/items"
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
      DistrictItemsPage,

  });

function DistrictItemsPage() {

  const { district } =
    Route.useParams();

  const data =
    Route.useLoaderData();

  const city =
    district
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );

  return (
    <>
      {/* <SEO
        title={`Medical Equipment in ${city}`}
        description={`Biomedical and laboratory equipment in ${city}.`}
        url={`https://humanbiomedical.org/${district}/items`}
      /> */}

      <ProductsIndex
        district={district}
        city={district}
        data={data}
      />
    </>
  );

}