import ContactPage from "../../contact/page";

export async function generateMetadata({ params }) {

  const { district } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `Contact Human Biomedical in ${city}`,
    description: `Contact Human Biomedical for biomedical equipment and services in ${city}.`,
  };
}

export default function DistrictContactPage() {
  return <ContactPage />;
}