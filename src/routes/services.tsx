import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, Settings, HeadphonesIcon, ShieldCheck, Truck, GraduationCap } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AMC, Installation & Support | Rajbiosis" },
      { name: "description", content: "Comprehensive after-sales services: equipment installation, AMC contracts, technical support, training and on-site service across India." },
      { property: "og:title", content: "Rajbiosis Services" },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Settings, title: "Installation & Commissioning", desc: "Certified engineers install, calibrate and validate every analyzer at your site with full IQ/OQ documentation." },
  { icon: ShieldCheck, title: "Annual Maintenance Contracts", desc: "Comprehensive and non-comprehensive AMC plans with preventive maintenance, parts and priority response." },
  { icon: Wrench, title: "On-Site Repairs", desc: "Pan-India service network with engineers in 40+ cities. SLA-backed response within 24–48 hours." },
  { icon: HeadphonesIcon, title: "Remote Technical Support", desc: "Phone, email and remote-desktop assistance for troubleshooting, software updates and operator queries." },
  { icon: GraduationCap, title: "Operator Training", desc: "On-site and virtual training for lab technicians on equipment operation, daily QC and troubleshooting basics." },
  { icon: Truck, title: "Reagents Subscription", desc: "Auto-replenishment of reagents and consumables on a monthly schedule — never run out mid-shift." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Services" title="Beyond the Sale — End-to-End Lab Support" description="From day-one installation to long-term maintenance, our service team keeps your lab running at peak performance." />
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant">
          <SectionHeader eyebrow="" title="Need a Service AMC?" description="Talk to our service desk for a tailored AMC quotation." />
          <Button asChild size="lg" variant="secondary"><Link to="/quote">Request Service Quote</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}
