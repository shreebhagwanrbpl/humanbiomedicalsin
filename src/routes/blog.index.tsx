import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  Calendar,
  Clock,
} from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";

import { PageHero } from "@/components/SectionHeader";

export const Route =
  createFileRoute(
    "/blog/"
  )({

    head: () => ({
      meta: [
        {
          title:
            "Blog — Lab Equipment Insights & Diagnostics Guides | Human Biomedicals",
        },

        {
          name: "description",

          content:
            "Articles, buying guides and how-tos on hematology analyzers, biochemistry, reagents and clinical lab best practices.",
        },

        {
          property: "og:title",

          content:
            "RaHuman Biomedicalsjbiosis Blog",
        },
      ],
    }),

    component:
      BlogIndex,
  });

export const posts = [
  {
    slug:
      "best-lab-equipment-2025",

    title:
      "Best Lab Equipment for Small & Medium Pathology Labs in 2025",

    excerpt:
      "A practical buying guide to building a productive pathology lab — from CBC analyzers to biochemistry, ESR and electrolytes.",

    date:
      "Mar 12, 2025",

    readTime:
      "8 min read",

    category:
      "Buying Guide",
  },

  {
    slug:
      "hematology-analyzer-guide",

    title:
      "Hematology Analyzer Guide: 3-Part vs 5-Part — Which Should You Buy?",

    excerpt:
      "Understand the differences between 3-part and 5-part hematology analyzers, throughput needs, and total cost of ownership.",

    date:
      "Feb 28, 2025",

    readTime:
      "6 min read",

    category:
      "Hematology",
  },

  {
    slug:
      "reagent-storage-best-practices",

    title:
      "Reagent Storage Best Practices: Extending Open-Vial Stability",

    excerpt:
      "Tips on temperature, humidity, light protection and rotation to maximize reagent shelf life and result accuracy.",

    date:
      "Feb 14, 2025",

    readTime:
      "5 min read",

    category:
      "Reagents",
  },

  {
    slug:
      "biochemistry-qc-daily",

    title:
      "Daily QC for Biochemistry: A Step-by-Step Workflow",

    excerpt:
      "Build a NABL-aligned daily QC routine: Levey-Jennings, Westgard rules and corrective actions when QC fails.",

    date:
      "Jan 30, 2025",

    readTime:
      "7 min read",

    category:
      "Quality Control",
  },
];

function BlogIndex({
  district,
}: {
  district?: string;
}) {

  const prefix =
    district
      ? `/${district}`
      : "";

  return (
    <SiteLayout
      district={district}
    >

      <PageHero
        eyebrow="Blog"

        title="Insights & Guides for Modern Labs"

        description="Practical articles on equipment, reagents, QC and lab management."
      />

      <section className="container mx-auto px-4 md:px-6 py-16">

        <div className="grid md:grid-cols-2 gap-6">

          {posts.map((p) => (

            <a
              key={p.slug}
              href={`${prefix}/blog/${p.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >

              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">

                {p.category}

              </span>

              <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">

                {p.title}

              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">

                {p.excerpt}

              </p>

              <div className="flex gap-4 text-xs text-muted-foreground">

                <span className="flex items-center gap-1">

                  <Calendar className="h-3.5 w-3.5" />

                  {p.date}

                </span>

                <span className="flex items-center gap-1">

                  <Clock className="h-3.5 w-3.5" />

                  {p.readTime}

                </span>

              </div>

            </a>

          ))}

        </div>

      </section>

    </SiteLayout>
  );
}

export default BlogIndex;