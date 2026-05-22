import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Human Biomedicals Pvt Ltd" },
      { name: "description", content: "Read how Human Biomedicals Pvt Ltd collects, uses and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="Last updated: March 2025" />
      <section className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information you provide directly — name, email, phone, company and enquiry details — when you fill our contact, quote or subscription forms.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">2. How We Use It</h2>
            <p className="text-muted-foreground">Information is used to respond to enquiries, process orders, deliver services and send relevant product updates. We never sell your data to third parties.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">3. Data Security</h2>
            <p className="text-muted-foreground">We implement administrative, technical and physical safeguards to protect your information against unauthorized access, alteration or destruction.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">4. Cookies</h2>
            <p className="text-muted-foreground">Our website uses essential cookies to operate and analytics cookies to understand traffic. You may disable cookies in your browser settings.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">5. Contact</h2>
            <p className="text-muted-foreground">For any privacy-related questions, write to info@humanbiomedicals.com.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
