import ItemsPage from "../../items/page";

export async function generateMetadata({
  params,
}) {

  const district =
    params?.district || "";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (c) => c.toUpperCase()
    );

  return {
    title:
      `Biomedical Equipment in ${city} | Human Biomedicals`,

    description:
      `Buy biomedical equipment and diagnostic analyzers in ${city}.`,
  };
}

export const revalidate = 3600;

export default async function DistrictItemsPage({ params }) {
  const { district } = await params;
  return <ItemsPage district={district} />;
}