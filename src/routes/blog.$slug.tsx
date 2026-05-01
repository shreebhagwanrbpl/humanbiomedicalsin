import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { posts } from "./blog.index";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} | Rajbiosis Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Button asChild><Link to="/blog">Back to Blog</Link></Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  return (
    <SiteLayout>
      <article className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">{post.category}</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">{post.title}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
        </div>
        <div className="prose prose-slate max-w-none space-y-5 text-foreground/90 leading-relaxed">
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          <p>Choosing the right diagnostic equipment for your lab is a long-term investment. From throughput requirements and footprint to reagent compatibility and after-sales service, every factor influences the productivity and reliability of your operations.</p>
          <h2 className="text-2xl font-bold mt-10 mb-3">Key considerations</h2>
          <p>Throughput is the first metric to define. A lab running 50 CBC tests per day has very different needs from one processing 500. Match the analyzer's rated speed against your peak hour load — not just the daily average.</p>
          <p>Reagent ecosystem matters too. Closed systems lock you in to manufacturer reagents (often higher cost, but tightly validated). Open systems give cost flexibility with broader reagent choices.</p>
          <h2 className="text-2xl font-bold mt-10 mb-3">After-sales service</h2>
          <p>Even the best machine becomes a liability without responsive service. Ask for documented SLAs, spare parts availability and AMC pricing before signing the purchase order.</p>
          <h2 className="text-2xl font-bold mt-10 mb-3">Conclusion</h2>
          <p>The right partner — not just the right product — is what keeps your lab productive year after year. Talk to our team for an unbiased recommendation tailored to your workflow.</p>
        </div>
        <div className="mt-12 rounded-2xl bg-gradient-primary text-primary-foreground p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Need help choosing?</h3>
          <p className="opacity-90 mb-5">Our experts can recommend the right setup for your lab in 15 minutes.</p>
          <Button asChild variant="secondary"><Link to="/quote">Talk to an Expert</Link></Button>
        </div>
      </article>
    </SiteLayout>
  );
}
