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

export default function DistrictServicesPage() {
  return <ServicesPage />;
}