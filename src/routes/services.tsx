import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  Wrench,
  Settings,
  HeadphonesIcon,
  ShieldCheck,
  Truck,
  GraduationCap,
} from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";

import {
  PageHero,
  SectionHeader,
} from "@/components/SectionHeader";

import { Button } from "@/components/ui/button";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const Route =
  createFileRoute(
    "/services"
  )({

    loader: async () => {

      const snap =
        await getDoc(
          doc(
            db,
            "websites",
            "humanbiomedicalsin",
            "pages",
            "services"
          )
        );

      const services =
        snap.exists()
          ? snap.data().services || []
          : [];

      return {
        services,
      };
    },

    head: () => ({
      meta: [
        {
          title:
            "Services — AMC, Installation & Support | Human Biomedicals",
        },

        {
          name: "description",

          content:
            "Comprehensive after-sales services: equipment installation, AMC contracts, technical support, training and on-site service across India.",
        },

        {
          property: "og:title",

          content:
            "Human Biomedicals Services",
        },
      ],
    }),

    component:
      ServicesPage,
  });

/* STATIC ICONS */
const icons = [
  Settings,
  ShieldCheck,
  Wrench,
  HeadphonesIcon,
  GraduationCap,
  Truck,
];

function ServicesPage({
  district,
  city,
  data,
}: {
  district?: string;
  city?: string;
  data?: any;
}) {

  let routeData: any = {};

  try {

    routeData =
      data ||
      Route.useLoaderData();

  } catch {

    routeData = {
      services: [],
    };

  }

  const services =
    routeData?.services || [];

  const prefix =
    district
      ? `/${district}`
      : "";

  return (
    <SiteLayout
      district={district}
    >

      <PageHero
        eyebrow="Services"

        title="Beyond the Sale — End-to-End Lab Support"

        description="From day-one installation to long-term maintenance, our service team keeps your lab running at peak performance."
      />

      <section className="container mx-auto px-4 md:px-6 py-16">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map(
            (
              s: any,
              index: number
            ) => {

              const Icon =
                icons[
                index %
                icons.length
                ];

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
                >

                  <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">

                    <Icon className="h-5 w-5" />

                  </div>

                  <h3 className="font-semibold mb-2">

                    {s.title}

                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">

                    {
                      typeof s.desc ===
                        "object"
                        ? s.desc.text ||
                        s.desc.richText
                        : s.desc
                    }

                  </p>

                </div>
              );
            }
          )}

        </div>

      </section>

      <section className="container mx-auto px-4 md:px-6 pb-20">

        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant">

          <SectionHeader
            eyebrow=""
            title="Need a Service AMC?"
            description="Talk to our service desk for a tailored AMC quotation."
          />

          <Button
            asChild
            size="lg"
            variant="secondary"
          >

            <a
              href={`${prefix}/quote`}
            >

              Request Service Quote

            </a>

          </Button>

        </div>

      </section>

    </SiteLayout>
  );
}

export default ServicesPage;