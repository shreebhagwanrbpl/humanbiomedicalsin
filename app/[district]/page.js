import Home from "../page";

export async function generateMetadata({
  params,
}) {

  const { district } =
    await params;

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (c) => c.toUpperCase()
    );

  return {
    title: `Biomedical Equipment in ${city}`,
    description:
      `Advanced biomedical equipment and healthcare solutions in ${city}.`,
  };
}

export default function DistrictPage() {
  return <Home />;
}