import AboutPage from "../../about/page";

export async function generateMetadata({ params }) {

  const { district } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `About Human Biomedical in ${city}`,
    description: `Learn about Human Biomedical and biomedical equipment services in ${city}.`,
  };
}

export default async function DistrictAboutPage({ params }) {

  const { district } = await params;

  return <AboutPage district={district} />;
}