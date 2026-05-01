import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/SectionHeader";
import { site } from "@/data/site";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Rajbiosis — Reach Our Sales & Support Team" },
      { name: "description", content: "Get in touch with Rajbiosis Pvt Ltd. Sales, support and AMC enquiries — phone, email, WhatsApp and office address." },
      { property: "og:title", content: "Contact Rajbiosis" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Get in Touch" description="We respond to all enquiries within 24 hours on business days." />
      <section className="container mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {[
            { icon: Phone, label: "Phone", value: site.phone },
            { icon: Mail, label: "Email", value: site.email },
            { icon: MapPin, label: "Address", value: site.address },
            { icon: Clock, label: "Hours", value: "Mon–Sat · 9:30 AM – 6:30 PM IST" },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
          <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
          <p className="text-sm text-muted-foreground mb-6">Fill the form and our team will reach out shortly.</p>
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}
