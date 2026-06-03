import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Human Biomedical LLP" },
      { name: "description", content: "Terms and conditions for using the Human Biomedical LLP website and services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title="Terms of Use" description="Last updated: March 2025" />
      <section className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          {[
            { t: "1. Acceptance of Terms", d: "By accessing this website you agree to be bound by these terms and all applicable laws and regulations." },
            { t: "2. Product Information", d: "Specifications, images and pricing are indicative and subject to change without notice. Final terms are confirmed on quotation." },
            { t: "3. Orders & Payment", d: "All orders are subject to acceptance. Payment terms are agreed in writing per quotation. Taxes are extra as applicable." },
            { t: "4. Warranty", d: "Equipment carries the manufacturer's warranty. Reagents and consumables are guaranteed within stated shelf life when stored as instructed." },
            { t: "5. Limitation of Liability", d: "Human Biomedicals is not liable for indirect, incidental or consequential damages arising from use of products or services." },
            { t: "6. Governing Law", d: "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of New Delhi courts." },
          ].map((s) => (
            <div key={s.t}>
              <h2 className="text-xl font-bold mb-2">{s.t}</h2>
              <p className="text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
