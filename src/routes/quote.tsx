import {
  createFileRoute,
} from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { QuoteForm } from "@/components/QuoteForm";

export const Route =
  createFileRoute("/quote")({

    validateSearch: (
      search: Record<string, unknown>
    ) => ({
      product:
        typeof search.product === "string"
          ? search.product
          : "",
    }),

    head: () => ({
      meta: [
        {
          title:
            "Get a Quote — Lab Equipment & Reagents | Human Biomedicals",
        },
        {
          name: "description",
          content:
            "Request a personalized quotation for hematology analyzers, biochemistry analyzers, reagents and lab consumables. 24-hour reply.",
        },
        {
          property: "og:title",
          content:
            "Request Quotation — Human Biomedicals",
        },
      ],
    }),

    component: QuoteRoutePage,
  });

function QuoteRoutePage() {

  const { product } =
    Route.useSearch();

  return (
    <QuotePage
      product={product}
    />
  );
}

function QuotePage({
  district,
  product = "",
}: {
  district?: string;
  product?: string;
}) {

  return (
    <SiteLayout district={district}>

      <PageHero
        eyebrow="Enquiry"
        title="Request a Quotation"
        description="Tell us what you need — we'll send a tailored quotation within 24 hours."
      />

      <section className="container mx-auto px-4 md:px-6 py-12">

        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-10 shadow-soft">

          <QuoteForm
            defaultProduct={product}
          />

        </div>

      </section>

    </SiteLayout>
  );
}

export default QuotePage;