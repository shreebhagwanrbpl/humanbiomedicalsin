export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`max-w-2xl mb-12 ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
      {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-gradient-hero border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        {description && (
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
