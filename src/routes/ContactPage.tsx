import { useEffect, useState } from "react";

import {
    Mail,
    Phone,
    MapPin,
    Clock,
} from "lucide-react";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { SiteLayout } from "@/components/SiteLayout";

import {
    PageHero,
} from "@/components/SectionHeader";

import { ContactForm } from "@/components/ContactForm";

/* 🔥 STATIC ICONS */
const icons: any = {
    Phone,

    Email: Mail,

    Mail,

    Address: MapPin,

    Location: MapPin,

    Hours: Clock,

    Timing: Clock,
};

type ContactPageProps = {
    district?: string;
};

export default function ContactPage({
    district,
}: ContactPageProps) {

    const [contactInfo, setContactInfo] =
        useState<any[]>([]);
    const [stateName, setStateName] =
        useState("");
    useEffect(() => {

        async function loadData() {

            const snap =
                await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "contact"
                    )
                );

            if (snap.exists()) {

                setContactInfo(
                    snap.data().contactInfo || []
                );
            }
        }

        loadData();

    }, []);
    useEffect(() => {

        const loadDistrict =
            async () => {

                if (!district) return;

                try {

                    const snap =
                        await getDoc(
                            doc(
                                db,
                                "websites",
                                "humanbiomedicalsin",
                                "districts",
                                district
                            )
                        );

                    if (snap.exists()) {

                        setStateName(
                            snap.data()?.state || ""
                        );

                    }

                } catch (err) {

                    console.log(err);

                }

            };

        loadDistrict();

    }, [district]);
    const city =
        district
            ? district
                .replace(/-/g, " ")
                .replace(
                    /\b\w/g,
                    (char) =>
                        char.toUpperCase()
                )
            : "";

    return (
        <SiteLayout district={district}>

            <PageHero
                eyebrow="Contact"

                title={
                    district
                        ? `Contact Us in ${city}`
                        : "Get in Touch"
                }

                description={
                    district
                        ? `Contact Human Biomedical for biomedical services, laboratory equipment support, AMC services and diagnostic solutions in ${city}.`
                        : "We respond to all enquiries within 24 hours on business days."
                }
            />

            <section className="container mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-8">

                {/* LEFT */}
                <div className="lg:col-span-1 space-y-4">

                    {contactInfo.map(
                        (
                            c: any,
                            index: number
                        ) => {

                            const Icon =
                                icons[c.label] ||
                                Phone;

                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                                >

                                    <div className="flex gap-3">

                                        <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center flex-shrink-0">

                                            <Icon className="h-4 w-4" />

                                        </div>

                                        <div>

                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">

                                                {c.label}

                                            </p>
                                            <p className="font-medium">

                                                {
                                                    c.label === "Address"

                                                        ? district

                                                            ? district === "jaipur"

                                                                ? typeof c.value === "object"
                                                                    ? c.value.text ||
                                                                    c.value.richText
                                                                    : c.value

                                                                : stateName

                                                                    ? `${city}, ${stateName}, India`

                                                                    : `${city}, India`

                                                            : typeof c.value === "object"
                                                                ? c.value.text ||
                                                                c.value.richText
                                                                : c.value

                                                        : typeof c.value === "object"
                                                            ? c.value.text ||
                                                            c.value.richText
                                                            : c.value
                                                }

                                            </p>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

                {/* RIGHT */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">

                    <h2 className="text-2xl font-bold mb-2">

                        Send us a message

                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">

                        Fill the form and our team will reach out shortly.

                    </p>

                    <ContactForm
                        district={district}
                    />

                </div>

            </section>

        </SiteLayout>
    );
}