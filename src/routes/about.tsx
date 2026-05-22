import { createFileRoute } from "@tanstack/react-router";

import {
  Target,
  Eye,
  Heart,
  Award,
} from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";

import {
  PageHero,
  SectionHeader,
} from "@/components/SectionHeader";

import aboutImg from "@/assets/about-lab.jpg";

export const Route =
  createFileRoute("/about")({

    head: () => ({
      meta: [
        {
          title:
            "About Human Biomedicals — 15+ Years in Medical Diagnostics Supply",
        },

        {
          name: "description",

          content:
            "Human Biomedicals Pvt Ltd is an ISO 13485 certified supplier of medical lab equipment, reagents and consumables since 2008.",
        },

        {
          property: "og:title",

          content:
            "About Human Biomedicals Pvt Ltd",
        },

        {
          property: "og:image",

          content:
            aboutImg,
        },

        {
          name: "twitter:image",

          content:
            aboutImg,
        },
      ],
    }),

    component: AboutPage,
  });

const values = [
  {
    icon: Target,

    title: "Mission",

    desc:
      "Empower every laboratory with reliable, affordable diagnostics technology.",
  },

  {
    icon: Eye,

    title: "Vision",

    desc:
      "Become India's most trusted partner for clinical lab equipment and reagents.",
  },

  {
    icon: Heart,

    title: "Values",

    desc:
      "Integrity, accuracy, customer-first service and continuous improvement.",
  },

  {
    icon: Award,

    title: "Certifications",

    desc:
      "ISO 13485:2016, CE-marked products, CDSCO registered import & distribution.",
  },
];

type AboutPageProps = {
  district?: string;
};

export default function AboutPage({
  district,
}: AboutPageProps) {

  const city =
    district
      ? district
        .replace(/-/g, " ")
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        )
      : "";

  return (
    <SiteLayout district={district}>

      <PageHero
        eyebrow="About Us"

        title={
          district
            ? `15+ Years of Diagnostic Excellence in ${city}`
            : "15+ Years of Diagnostic Excellence"
        }

        description={
          district
            ? `Human Biomedicals Pvt Ltd has been a trusted diagnostic partner in ${city}.`
            : "Human Biomedicals Pvt Ltd has been a trusted partner to clinical laboratories across India since 2008."
        }
      />

      <section className="container mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">

        <img
          src={aboutImg}
          alt="Human Biomedicals laboratory team"
          loading="lazy"
          width={1280}
          height={800}
          className="rounded-2xl shadow-elegant w-full h-auto"
        />

        <div>

          <h2 className="text-3xl font-bold mb-5">

            Who We Are

          </h2>

          <p className="text-muted-foreground leading-relaxed mb-4">

            Founded in 2008,
            Human Biomedicals Pvt Ltd has grown
            into one of India's most
            trusted suppliers of
            medical laboratory equipment,
            in-vitro diagnostic reagents
            and lab consumables.

          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">

            Our portfolio spans
            hematology analyzers,
            biochemistry analyzers,
            ELISA readers,
            electrolyte analyzers,
            ready-to-use reagents
            and a complete
            consumables range.

          </p>

          <p className="text-muted-foreground leading-relaxed">

            With ISO 13485:2016
            certification and CDSCO
            registration,
            we deliver equipment
            and reagents that meet
            the highest international
            quality standards.

          </p>

        </div>

      </section>

      <section className="bg-muted/30 py-20">

        <div className="container mx-auto px-4 md:px-6">

          <SectionHeader
            eyebrow="What Drives Us"

            title="Mission, Vision & Values"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {values.map((v) => (

              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-smooth"
              >

                <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">

                  <v.icon className="h-5 w-5" />

                </div>

                <h3 className="font-semibold mb-2">

                  {v.title}

                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">

                  {v.desc}

                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

    </SiteLayout>
  );
}