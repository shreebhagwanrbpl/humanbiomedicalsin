import ServicesPage from "../../services/page";

export async function generateMetadata({ params }) {

  const { district } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `Biomedical Services in ${city}`,
    description: `Biomedical equipment installation, AMC, repair and maintenance services in ${city}.`,
  };
}

export const revalidate = 3600;

export default async function DistrictServicesPage({ params }) {
  const { district } = await params;
  return <ServicesPage district={district} />;
}