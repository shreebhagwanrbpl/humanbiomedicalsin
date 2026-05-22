import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

import ContactPage from "@/routes/ContactPage";

import {
  isValidDistrict,
} from "@/lib/districts";

export const Route =
  createFileRoute(
    "/$district/contact"
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
      DistrictContactPage,
  });

function DistrictContactPage() {

  const { district } =
    Route.useParams();

  return (
    <ContactPage
      district={district}
    />
  );
}