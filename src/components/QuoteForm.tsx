import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { categories } from "@/data/products";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  category: z.string().min(1, "Select a category"),
  product: z.string().trim().max(200).optional().or(z.literal("")),
  quantity: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(1000),
});

export function QuoteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(form), category };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Quote request received! Expect a reply within 24 hours.");
    e.currentTarget.reset();
    setCategory("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name *" name="name" error={errors.name} />
        <Field label="Email *" name="email" type="email" error={errors.email} />
        <Field label="Phone *" name="phone" error={errors.phone} />
        <Field label="Company / Lab" name="company" error={errors.company} />
      </div>
      <div>
        <Label>Category *</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Product (optional)" name="product" error={errors.product} />
        <Field label="Quantity (optional)" name="quantity" error={errors.quantity} />
      </div>
      <div>
        <Label htmlFor="message">Requirements *</Label>
        <Textarea id="message" name="message" rows={5} placeholder="Describe your requirement, throughput, current setup, etc." />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} size="lg" className="w-full bg-gradient-primary shadow-soft">
        {submitting ? "Submitting..." : "Submit Enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">By submitting, you agree to our privacy policy.</p>
    </form>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
