// import hematologyImg from "@/assets/cat-hematology.jpg";
// import biochemistryImg from "@/assets/cat-biochemistry.jpg";
// import reagentsImg from "@/assets/cat-reagents.jpg";
// import consumablesImg from "@/assets/cat-consumables.jpg";

// export type CategorySlug = "hematology" | "biochemistry" | "reagents" | "consumables";

// export interface Category {
//   slug: CategorySlug;
//   name: string;
//   tagline: string;
//   description: string;
//   image: string;
// }

// export interface Product {
//   slug: string;
//   name: string;
//   category: CategorySlug;
//   shortDescription: string;
//   description: string;
//   image: string;
//   features: string[];
//   specs: { label: string; value: string }[];
//   featured?: boolean;
// }

// export const categories: Category[] = [
//   {
//     slug: "hematology",
//     name: "Hematology Machines",
//     tagline: "Precision blood analyzers",
//     description:
//       "Fully automated 3-part and 5-part hematology analyzers built for clinical labs of every scale.",
//     image: hematologyImg,
//   },
//   {
//     slug: "biochemistry",
//     name: "Biochemistry Machines",
//     tagline: "Clinical chemistry analyzers",
//     description:
//       "Semi-automated and fully automated biochemistry analyzers delivering accurate, reproducible results.",
//     image: biochemistryImg,
//   },
//   {
//     slug: "reagents",
//     name: "Reagents & Kits",
//     tagline: "Open & closed system reagents",
//     description:
//       "Premium grade reagents and ready-to-use test kits compatible with major lab equipment brands.",
//     image: reagentsImg,
//   },
//   {
//     slug: "consumables",
//     name: "Consumables",
//     tagline: "Diluents, controls, calibrators",
//     description:
//       "Daily-use lab consumables — diluent, lyse, cleaner, controls and calibrators — for uninterrupted workflow.",
//     image: consumablesImg,
//   },
// ];

// export const products: Product[] = [
//   {
//     slug: "rb-hema-5d-plus",
//     name: "RB Hema 5D Plus — 5-Part Hematology Analyzer",
//     category: "hematology",
//     shortDescription: "Fully auto 5-part differential CBC analyzer with 90 tests/hour throughput.",
//     description:
//       "The RB Hema 5D Plus is a state-of-the-art fully automated 5-part hematology analyzer engineered for medium and high-throughput laboratories. With advanced laser flow cytometry and SF cube technology, it delivers reliable CBC + DIFF results in under 60 seconds.",
//     image: hematologyImg,
//     features: [
//       "5-part differential WBC count",
//       "29 reportable parameters",
//       "Throughput: 90 samples/hour",
//       "Auto-loader with 50-sample capacity",
//       "10.4\" color touchscreen",
//       "Bi-directional LIS connectivity",
//     ],
//     specs: [
//       { label: "Principle", value: "Laser flow cytometry + SLS-Hb" },
//       { label: "Throughput", value: "90 tests/hour" },
//       { label: "Sample volume", value: "20 µL whole blood" },
//       { label: "Storage", value: "100,000 results with histograms" },
//       { label: "Power", value: "AC 100–240V, 50/60 Hz" },
//       { label: "Dimensions", value: "560 × 580 × 600 mm" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "rb-hema-3d",
//     name: "RB Hema 3D — 3-Part Hematology Analyzer",
//     category: "hematology",
//     shortDescription: "Compact 3-part CBC analyzer ideal for small to medium labs.",
//     description:
//       "Reliable, compact and affordable — the RB Hema 3D is a 3-part differential analyzer designed for clinics, nursing homes and small diagnostic labs. 21 parameters with onboard QC.",
//     image: hematologyImg,
//     features: [
//       "3-part WBC differential",
//       "21 reportable parameters",
//       "Throughput: 60 tests/hour",
//       "Built-in thermal printer",
//       "Closed and open mode sampling",
//     ],
//     specs: [
//       { label: "Principle", value: "Impedance + colorimetric Hb" },
//       { label: "Throughput", value: "60 tests/hour" },
//       { label: "Sample volume", value: "10 µL whole blood" },
//       { label: "Display", value: "8\" LCD touchscreen" },
//       { label: "Dimensions", value: "420 × 460 × 480 mm" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "rb-bio-200",
//     name: "RB Bio 200 — Semi-Auto Biochemistry Analyzer",
//     category: "biochemistry",
//     shortDescription: "Semi-automated clinical chemistry analyzer with peltier-controlled cuvette.",
//     description:
//       "The RB Bio 200 is a microprocessor-controlled, semi-automated biochemistry analyzer. Peltier temperature control ensures stable readings for kinetic, end-point and fixed-time assays.",
//     image: biochemistryImg,
//     features: [
//       "Peltier-controlled flow cell at 37°C",
//       "8 filters: 340–670 nm",
//       "End-point, kinetic, fixed-time, absorbance modes",
//       "Stores 1000+ programs",
//       "USB and Ethernet connectivity",
//     ],
//     specs: [
//       { label: "Wavelength", value: "340, 405, 505, 546, 578, 620, 670 nm" },
//       { label: "Flow cell", value: "32 µL quartz, peltier 37°C ±0.1" },
//       { label: "Linearity", value: "0–3.0 Abs" },
//       { label: "Display", value: "7\" color touchscreen" },
//       { label: "Power", value: "AC 220V ±10%, 50 Hz" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "rb-bio-auto-400",
//     name: "RB Bio Auto 400 — Fully Auto Biochemistry Analyzer",
//     category: "biochemistry",
//     shortDescription: "Random-access auto analyzer, 400 tests/hour with ISE option.",
//     description:
//       "Fully automated random-access discrete clinical chemistry analyzer with optional integrated ISE module for Na+/K+/Cl-.",
//     image: biochemistryImg,
//     features: [
//       "Throughput: 400 photometric + 200 ISE tests/hour",
//       "90-position reagent tray, refrigerated",
//       "STAT priority sampling",
//       "Auto-calibration and auto-QC",
//       "Bi-directional LIS interface",
//     ],
//     specs: [
//       { label: "Methods", value: "End-point, kinetic, two-point, ISE" },
//       { label: "Wavelengths", value: "12 wavelengths, 340–800 nm" },
//       { label: "Reaction volume", value: "180–360 µL" },
//       { label: "Cuvettes", value: "90 hard plastic, reusable" },
//       { label: "Footprint", value: "1100 × 750 × 1180 mm" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "cbc-reagent-pack",
//     name: "CBC Reagent Pack (Diluent + Lyse + Cleaner)",
//     category: "reagents",
//     shortDescription: "Open-system 3-part hematology reagent kit, 20L diluent + 1L lyse + 1L cleaner.",
//     description:
//       "Premium open-system reagent pack compatible with all major 3-part hematology analyzers. Long shelf life and stable performance across temperature ranges.",
//     image: reagentsImg,
//     features: [
//       "Compatible with most 3-part analyzers",
//       "Shelf life: 18 months",
//       "ISO 13485 manufactured",
//       "Lot-to-lot consistency",
//     ],
//     specs: [
//       { label: "Pack contains", value: "20L Diluent, 1L Lyse, 1L Cleaner" },
//       { label: "Storage", value: "15–30°C, away from sunlight" },
//       { label: "Shelf life", value: "18 months unopened" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "biochem-test-kit-50",
//     name: "Biochemistry Test Kit Series (50 parameters)",
//     category: "reagents",
//     shortDescription: "Liquid-stable ready-to-use biochemistry reagents — glucose, lipid, LFT, KFT.",
//     description:
//       "Complete range of liquid-stable biochemistry reagent kits including Glucose, Urea, Creatinine, SGOT, SGPT, Cholesterol, Triglycerides, HDL, Bilirubin and 40+ more parameters.",
//     image: reagentsImg,
//     features: [
//       "Ready-to-use liquid stable formats",
//       "Calibrator + control included on request",
//       "Compatible with semi & fully auto analyzers",
//       "Long open-vial stability",
//     ],
//     specs: [
//       { label: "Pack sizes", value: "2×20 mL, 4×50 mL, 6×100 mL" },
//       { label: "Stability", value: "Up to 12 months unopened" },
//       { label: "Storage", value: "2–8°C" },
//     ],
//     featured: true,
//   },
//   {
//     slug: "hematology-controls",
//     name: "Hematology Tri-Level Controls",
//     category: "consumables",
//     shortDescription: "Low / Normal / High commutable QC controls for daily QC runs.",
//     description:
//       "Whole blood–based hematology controls with assayed values for all 5-part parameters. Essential for daily QC, internal QA and accreditation compliance.",
//     image: consumablesImg,
//     features: [
//       "Tri-level: Low / Normal / High",
//       "Assayed values for 5-part diff",
//       "Open vial stability: 14 days",
//       "Compatible with all major analyzers",
//     ],
//     specs: [
//       { label: "Pack", value: "3 × 2.5 mL" },
//       { label: "Storage", value: "2–8°C" },
//       { label: "Shelf life", value: "120 days unopened" },
//     ],
//   },
//   {
//     slug: "isotonic-diluent-20l",
//     name: "Isotonic Diluent 20L",
//     category: "consumables",
//     shortDescription: "High-purity isotonic diluent for hematology analyzers.",
//     description:
//       "Bacteriostatic isotonic diluent formulated for use with 3-part and 5-part hematology analyzers. Filter-sterilized and quality-tested batch by batch.",
//     image: consumablesImg,
//     features: [
//       "0.22 µm filter sterilized",
//       "Stable conductivity & osmolality",
//       "Universal compatibility",
//     ],
//     specs: [
//       { label: "Volume", value: "20 L cubitainer" },
//       { label: "pH", value: "7.3 ± 0.1" },
//       { label: "Storage", value: "15–30°C" },
//     ],
//   },
// ];

// export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
// export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
// export const getProductsByCategory = (slug: CategorySlug) =>
//   products.filter((p) => p.category === slug);
// export const getFeatured = () => products.filter((p) => p.featured).slice(0, 6);
export interface Product {
  id: string;

  title: string;

  price: string;

  desc: any;

  capacity: string;

  throughput: string;

  instrument: string;

  model: string;

  usage: string;

  brand: string;

  parameters: string;

  automation: string;

  availability: string;

  size: string;

  image: string;

  createdAt?: string;

  isPublished?: boolean;
}

export interface Category {
  slug: string;

  name: string;
}

/* 🔥 Dynamic category generator */
export const getCategoriesFromProducts = (
  products: Product[]
): Category[] => {

  const unique = [
    ...new Set(
      products.map(
        (p) => p.instrument || "Other"
      )
    ),
  ];

  return unique.map((item) => ({
    slug: item.toLowerCase(),

    name: item,
  }));
};

/* 🔥 Get single product */
export const getProduct = (
  products: Product[],
  id: string
) => {

  return products.find(
    (p) => p.id === id
  );
};

/* 🔥 Category filter */
export const getProductsByCategory = (
  products: Product[],
  category: string
) => {

  return products.filter(
    (p) =>
      p.instrument?.toLowerCase() ===
      category.toLowerCase()
  );
};

/* 🔥 Featured products */
export const getFeatured = (
  products: Product[]
) => {

  return products
    .filter((p) => p.isPublished)
    .slice(0, 6);
};