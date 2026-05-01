import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Wrench, Award, Users, Package, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { categories, getFeatured } from "@/data/products";
import { site } from "@/data/site";
import heroImg from "@/assets/hero-lab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rajbiosis Pvt Ltd — Medical Lab Equipment, Reagents & Diagnostics" },
      {
        name: "description",
        content:
          "Rajbiosis supplies premium hematology & biochemistry analyzers, reagents and lab consumables to clinical laboratories across India.",
      },
      { property: "og:title", content: "Rajbiosis Pvt Ltd — Precision Diagnostics" },
      { property: "og:description", content: "Premium medical lab equipment, reagents & diagnostics supply." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

const stats = [
  { icon: Users, value: "1,200+", label: "Happy Clients" },
  { icon: Package, value: "150+", label: "Products" },
  { icon: Calendar, value: "15+ yrs", label: "Experience" },
  { icon: Award, value: "ISO 13485", label: "Certified" },
];

const reasons = [
  { icon: ShieldCheck, title: "Quality Assured", desc: "ISO 13485 certified manufacturing with batch-level QC and traceability." },
  { icon: Wrench, title: "Pan-India Service", desc: "On-site installation, AMC and rapid technical support across India." },
  { icon: Truck, title: "Fast Dispatch", desc: "Reagents and consumables shipped within 24 hours of order confirmation." },
  { icon: Award, title: "2 Year Warranty", desc: "All analyzers ship with 2-year comprehensive warranty plus optional AMC." },
];

const testimonials = [
  { name: "Dr. Anjali Mehta", role: "Lab Director, Apollo Diagnostics", quote: "Rajbiosis analyzers have run flawlessly for 3 years. Their service team is exceptional." },
  { name: "Ravi Sharma", role: "Owner, Sharma Path Lab", quote: "Reagents are consistent batch after batch. Pricing is competitive and delivery is always on time." },
  { name: "Dr. Karthik Iyer", role: "Pathologist, City Hospital", quote: "Switched to RB Bio Auto 400 last year — throughput nearly doubled with zero downtime." },
];

function HomePage() {
  const featured = getFeatured();
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium mb-5">
              <ShieldCheck className="h-3.5 w-3.5" /> ISO 13485 Certified Supplier
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Precision Diagnostics. <span className="text-gradient">Trusted Worldwide.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {site.name} delivers premium hematology & biochemistry analyzers, reagents and consumables to clinical laboratories across India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary shadow-soft hover:shadow-glow transition-smooth">
                <Link to="/quote">Get Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/products">Explore Products</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-6 bg-gradient-primary rounded-[2.5rem] blur-3xl opacity-20" />
            <img
              src={heroImg}
              alt="Modern hematology analyzer"
              width={1600}
              height={1024}
              className="relative rounded-3xl shadow-elegant w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <SectionHeader eyebrow="Browse" title="Shop by Category" description="Complete range of lab equipment, reagents and consumables — engineered for accuracy and reliability." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products/category/$category"
              params={{ category: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="Bestsellers" title="Featured Products" description="Our most-requested analyzers, reagents and kits — trusted by 1,200+ labs." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <SectionHeader eyebrow="Why Rajbiosis" title="Built on Trust & Service" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-smooth">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gradient-deep text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="h-7 w-7 mx-auto mb-3 opacity-90" />
              <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <SectionHeader eyebrow="Testimonials" title="What Labs Say About Us" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-primary mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 mb-5">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant overflow-hidden relative">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">Ready to upgrade your lab?</h2>
          <p className="max-w-xl mx-auto mb-7 opacity-90 relative">
            Get a personalized quotation for analyzers, reagents and consumables — replies within 24 hours.
          </p>
          <Button asChild size="lg" variant="secondary" className="relative">
            <Link to="/quote">Request Quotation <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
