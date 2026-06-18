import ItemsPage from "../../items/page";

export async function generateMetadata({ params }) {

  const { district } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Biomedical Equipment in ${city}`,
    description: `Buy biomedical equipment and diagnostic analyzers in ${city}.`,
  };
}

export default function DistrictItemsPage() {
  return <ItemsPage />;
}