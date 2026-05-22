import { useState } from "react";

import { z } from "zod";

import toast, {
  Toaster,
} from "react-hot-toast";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getProductsByCategory,
} from "@/data/products";

const schema = z.object({
  name:
    z.string()
      .trim()
      .min(2)
      .max(100),

  email:
    z.string()
      .trim()
      .email()
      .max(255),

  phone:
    z.string()
      .trim()
      .min(7)
      .max(20),

  company:
    z.string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal("")),

  category:
    z.string()
      .min(
        1,
        "Select a category"
      ),

  product:
    z.string()
      .trim()
      .max(200)
      .optional()
      .or(z.literal("")),

  quantity:
    z.string()
      .trim()
      .max(50)
      .optional()
      .or(z.literal("")),

  message:
    z.string()
      .trim()
      .min(5)
      .max(1000),
});

export function QuoteForm() {

  const categories = [
    {
      slug: "hematology",
      name: "Hematology",
    },

    {
      slug: "biochemistry",
      name: "Biochemistry",
    },

    {
      slug: "immunology",
      name: "Immunology",
    },

    {
      slug: "elisa",
      name: "ELISA",
    },

    {
      slug: "electrolyte",
      name: "Electrolyte",
    },

    {
      slug: "consumables",
      name: "Consumables",
    },

    {
      slug: "reagents",
      name: "Reagents",
    },

    {
      slug: "microscope",
      name: "Microscope",
    },
  ];

  const [submitting, setSubmitting] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const onSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();

      const form =
        new FormData(
          e.currentTarget
        );

      const data = {
        ...Object.fromEntries(form),
        category,
      };

      const parsed =
        schema.safeParse(data);

      if (!parsed.success) {

        const errs:
          Record<string, string> = {};

        parsed.error.issues.forEach(
          (i) => {

            errs[
              i.path[0] as string
            ] = i.message;

          }
        );

        setErrors(errs);

        toast.error(
          "Please fill all required fields correctly"
        );

        return;

      }

      setErrors({});

      setSubmitting(true);

      try {

        await addDoc(
          collection(
            db,
            "websitesQueries",
            "humanbiomedicalsin",
            "productQueries"
          ),
          {
            ...parsed.data,

            createdAt:
              serverTimestamp(),
          }
        );

        toast.success(
          "Quote request submitted successfully!",
          {
            duration: 3000,
          }
        );

        e.currentTarget.reset();

        setCategory("");

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to submit enquiry. Please try again later.",
          {
            duration: 4000,
          }
        );

      }

      setSubmitting(false);

    };

  return (

    <>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >

        <div className="grid sm:grid-cols-2 gap-4">

          <Field
            label="Full Name *"
            name="name"
            error={errors.name}
          />

          <Field
            label="Email *"
            name="email"
            type="email"
            error={errors.email}
          />

          <Field
            label="Phone *"
            name="phone"
            error={errors.phone}
          />

          <Field
            label="Company / Lab"
            name="company"
            error={errors.company}
          />

        </div>

        <div>

          <Label>
            Category *
          </Label>

          <Select
            value={category}
            onValueChange={setCategory}
          >

            <SelectTrigger>

              <SelectValue
                placeholder="Select a category"
              />

            </SelectTrigger>

            <SelectContent>

              {categories.map((c) => (

                <SelectItem
                  key={c.slug}
                  value={c.slug}
                >

                  {c.name}

                </SelectItem>

              ))}

            </SelectContent>

          </Select>

          {errors.category && (

            <p className="text-xs text-destructive mt-1">

              {errors.category}

            </p>

          )}

        </div>

        <div className="grid sm:grid-cols-2 gap-4">

          <Field
            label="Product (optional)"
            name="product"
            error={errors.product}
          />

          <Field
            label="Quantity (optional)"
            name="quantity"
            error={errors.quantity}
          />

        </div>

        <div>

          <Label htmlFor="message">

            Requirements *

          </Label>

          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Describe your requirement, throughput, current setup, etc."
          />

          {errors.message && (

            <p className="text-xs text-destructive mt-1">

              {errors.message}

            </p>

          )}

        </div>

        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="w-full bg-gradient-primary shadow-soft"
        >

          {submitting
            ? "Submitting..."
            : "Submit Enquiry"}

        </Button>

        <p className="text-xs text-muted-foreground text-center">

          By submitting, you agree to our privacy policy.

        </p>

      </form>

      <Toaster
        position="top-right"
      />

    </>

  );

}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;

  name: string;

  type?: string;

  error?: string;
}) {

  return (

    <div>

      <Label htmlFor={name}>

        {label}

      </Label>

      <Input
        id={name}
        name={name}
        type={type}
      />

      {error && (

        <p className="text-xs text-destructive mt-1">

          {error}

        </p>

      )}

    </div>

  );

}