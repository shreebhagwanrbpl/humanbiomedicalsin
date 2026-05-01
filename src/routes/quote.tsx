import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { QuoteForm } from "@/components/QuoteForm";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Quote — Lab Equipment & Reagents | Rajbiosis" },
      { name: "description", content: "Request a personalized quotation for hematology analyzers, biochemistry analyzers, reagents and lab consumables. 24-hour reply." },
      { property: "og:title", content: "Request Quotation — Rajbiosis" },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Enquiry" title="Request a Quotation" description="Tell us what you need — we'll send a tailored quotation within 24 hours." />
      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-10 shadow-soft">
          <QuoteForm />
        </div>
      </section>
    </SiteLayout>
  );
}
