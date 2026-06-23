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

export default function DistrictItemsPage() {
  return <ItemsPage />;
}