// import { createFileRoute } from "@tanstack/react-router";

// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
// } from "lucide-react";

// import { SiteLayout } from "@/components/SiteLayout";

// import {
//   PageHero,
// } from "@/components/SectionHeader";

// import { ContactForm } from "@/components/ContactForm";

// import {
//   doc,
//   getDoc,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";

// export const Route =
//   createFileRoute("/contact")({

//     loader: async () => {

//       const snap =
//         await getDoc(
//           doc(
//             db,
//             "websites",
//             "humanbiomedicalsin",
//             "pages",
//             "contact"
//           )
//         );

//       const contactInfo =
//         snap.exists()
//           ? snap.data()
//             .contactInfo || []
//           : [];

//       return {
//         contactInfo,
//       };
//     },

//     head: () => ({
//       meta: [
//         {
//           title:
//             "Contact Human Biomedicals — Reach Our Sales & Support Team",
//         },

//         {
//           name:
//             "description",

//           content:
//             "Get in touch with Human Biomedicals Pvt Ltd. Sales, support and AMC enquiries — phone, email, WhatsApp and office address.",
//         },

//         {
//           property:
//             "og:title",

//           content:
//             "Contact Human Biomedicals",
//         },
//       ],
//     }),

//     component:
//       ContactPage,
//   });

// /* 🔥 STATIC ICONS */
// const icons: any = {
//   Phone,

//   Email: Mail,

//   Mail,

//   Address: MapPin,

//   Location: MapPin,

//   Hours: Clock,

//   Timing: Clock,
// };

// type ContactPageProps = {
//   district?: string;
// };

// export default function ContactPage({
//   district,
// }: ContactPageProps) {

//   let data: any = {};

//   try {

//     data =
//       Route.useLoaderData();

//   } catch {

//     data = {
//       contactInfo: [],
//     };

//   }

//   const contactInfo =
//     data.contactInfo || [];

//   const city =
//     district
//       ? district
//         .replace(/-/g, " ")
//         .replace(
//           /\b\w/g,
//           (char) =>
//             char.toUpperCase()
//         )
//       : "";

//   return (
//     <SiteLayout>

//       <PageHero
//         eyebrow="Contact"

//         title={
//           district
//             ? `Contact Us in ${city}`
//             : "Get in Touch"
//         }

//         description={
//           district
//             ? `Contact Human Biomedical for biomedical services in ${city}.`
//             : "We respond to all enquiries within 24 hours on business days."
//         }
//       />

//       <section className="container mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-8">

//         {/* LEFT */}
//         <div className="lg:col-span-1 space-y-4">

//           {contactInfo.map(
//             (
//               c: any,
//               index: number
//             ) => {

//               const Icon =
//                 icons[c.label] ||
//                 Phone;

//               return (
//                 <div
//                   key={index}
//                   className="rounded-2xl border border-border bg-card p-5 shadow-soft"
//                 >

//                   <div className="flex gap-3">

//                     <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center flex-shrink-0">

//                       <Icon className="h-4 w-4" />

//                     </div>

//                     <div>

//                       <p className="text-xs text-muted-foreground uppercase tracking-wider">

//                         {c.label}

//                       </p>

//                       <p className="font-medium">

//                         {
//                           typeof c.value ===
//                             "object"
//                             ? c.value.text ||
//                             c.value.richText
//                             : c.value
//                         }

//                       </p>

//                     </div>

//                   </div>

//                 </div>
//               );
//             }
//           )}

//         </div>

//         {/* RIGHT */}
//         <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">

//           <h2 className="text-2xl font-bold mb-2">

//             Send us a message

//           </h2>

//           <p className="text-sm text-muted-foreground mb-6">

//             Fill the form and our team will reach out shortly.

//           </p>

//           <ContactForm
//             district={district}
//           />

//         </div>

//       </section>

//     </SiteLayout>
//   );
// }

import {
  createFileRoute,
} from "@tanstack/react-router";

import ContactPage from "@/routes/ContactPage";

export const Route =
  createFileRoute("/contact")({

    component: ContactPage,

  });