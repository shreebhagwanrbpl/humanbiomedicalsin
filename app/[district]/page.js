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

  const title =
    `Biomedical Equipment Supplier in ${city} | Human Biomedicals`;

  const description =
    `Human Biomedicals supplies CBC Machines, Hematology Analyzers, Biochemistry Analyzers, ELISA Readers and Laboratory Equipment in ${city}. Installation, support and service available.`;

  const url =
    `https://humanbiomedicals.in/${district}`;

  return {
    title,
    description,

    keywords: [
      `Biomedical Equipment ${city}`,
      `Medical Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `CBC Machine ${city}`,
      `Hematology Analyzer ${city}`,
      `Biochemistry Analyzer ${city}`,
      `Diagnostic Equipment ${city}`,
      "Human Biomedicals",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName:
        "Human Biomedicals",
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DistrictPage({
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

  return <Home city={city} />;
}