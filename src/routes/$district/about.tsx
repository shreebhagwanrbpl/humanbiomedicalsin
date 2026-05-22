import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

import AboutPage from "@/routes/about";

import {
  isValidDistrict,
} from "@/lib/districts";

export const Route =
  createFileRoute(
    "/$district/about"
  )({

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
      DistrictAboutPage,
  });

function DistrictAboutPage() {

  const { district } =
    Route.useParams();

  return (
    <>
      <AboutPage
        district={district}
      />
    </>
  );
}