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

import ServicesPage from "@/routes/services";

export const Route =
  createFileRoute(
    "/$district/services"
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

      const servicesSnap =
        await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsin",
            "pages",
            "services"
          )
        );

      return servicesSnap.exists()
        ? servicesSnap.data()
        : {};

    },

    component:
      DistrictServicesPage,

  });

function DistrictServicesPage() {

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
        title={`Biomedical Services in ${city}`}
        description={`Professional biomedical services in ${city}.`}
        url={`https://humanbiomedical.org/${district}/services`}
      /> */}

      <ServicesPage
        district={district}
        city={district}
        data={data}
      />
    </>
  );

}