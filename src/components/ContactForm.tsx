import { useState } from "react";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// import {
//   useParams,
// } from "@tanstack/react-router";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(255),

  phone: z
    .string()
    .trim()
    .min(7, "Phone is required")
    .max(20),

  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more")
    .max(1000),
});

type ContactFormProps = {
  district?: string;
};

export function ContactForm({
  district,
}: ContactFormProps) {



  const [submitting, setSubmitting] =
    useState(false);

  const [errors, setErrors] =
    useState<
      Record<string, string>
    >({});

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const formEl =
      e.currentTarget;

    const form =
      new FormData(formEl);

    const data =
      Object.fromEntries(form);

    const parsed =
      schema.safeParse(data);

    // 🔥 VALIDATION
    if (!parsed.success) {

      const errs:
        Record<string, string> =
        {};

      parsed.error.issues.forEach(
        (i) => {

          errs[
            i.path[0] as string
          ] = i.message;
        }
      );

      setErrors(errs);

      return;
    }

    setErrors({});

    setSubmitting(true);

    try {

      // 🔥 SAVE TO FIREBASE
      await addDoc(

        collection(
          db,
          "websitesQueries",
          "humanbiomedicalsin",
          "contactQueries"
        ),

        {
          name: data.name,

          email: data.email,

          phone: data.phone,

          message: data.message,

          district,

          createdAt:
            serverTimestamp(),
        }
      );

      toast.success(
        "Message sent successfully!"
      );

      formEl.reset();

    } catch (err) {

      console.error(err);

      toast.error(
        "Something went wrong"
      );

    } finally {

      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >

      <div className="grid sm:grid-cols-2 gap-4">

        <Field
          label="Full Name"
          name="name"
          error={errors.name}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          error={errors.email}
        />

      </div>

      <Field
        label="Phone"
        name="phone"
        error={errors.phone}
      />

      <div>

        <Label htmlFor="message">

          Message

        </Label>

        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can we help?"
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
        className="w-full bg-gradient-primary"
      >

        {submitting
          ? "Sending..."
          : "Send Message"}

      </Button>

    </form>
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