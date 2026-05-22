import {
  Link,
  useParams,
} from "@tanstack/react-router";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { site } from "@/data/site";

import logo from "@/assets/humanlogo.png";

export function Footer() {

  const params = useParams({
    strict: false,
  });

  const district =
    (params as any)
      ?.district;
  const [stateName, setStateName] =
    useState("");
  const [contactInfo, setContactInfo] =
    useState<any[]>([]);
  const city =
    district
      ? district
        .replace(/-/g, " ")
        .replace(
          /\b\w/g,
          (char: string) =>
            char.toUpperCase()
        )
      : "";
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
  useEffect(() => {

    const loadContact =
      async () => {

        try {

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
              snap.data()
                .contactInfo || []
            );

          }

        } catch (err) {

          console.log(err);

        }

      };

    loadContact();

  }, []);
  const address =
    contactInfo.find(
      (c: any) =>
        c.label
          ?.toLowerCase()
          .includes("address")
    )?.value || site.address;
  const categories: any[] = [];

  return (

    <footer className="border-t border-border bg-muted/30 mt-24">

      <div className="container mx-auto px-4 md:px-6 py-14 grid gap-10 md:grid-cols-4">

        <div>

          <Link
            to={
              district
                ? "/$district"
                : "/"
            }
            params={
              district
                ? { district }
                : undefined
            }
            className="flex items-center gap-2 font-bold text-lg mb-4"
          >

            <div className="flex h-17 w-17 items-center justify-center rounded-lg shadow-soft overflow-hidden">

              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-contain"
              />

            </div>

          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed">

            {site.description}

          </p>

        </div>

        <div>

          <h4 className="text-sm font-semibold mb-4">

            Company

          </h4>

          <ul className="space-y-2 text-sm">

            {[
              {
                to: district
                  ? "/$district/about"
                  : "/about",

                label: "About Us",
              },

              {
                to: district
                  ? "/$district/services"
                  : "/services",

                label: "Services",
              },

              {
                to: district
                  ? "/$district/blog"
                  : "/blog",

                label: "Blog",
              },

              {
                to: district
                  ? "/$district/contact"
                  : "/contact",

                label: "Contact",
              },

              {
                to: district
                  ? "/$district/quote"
                  : "/quote",

                label: "Get Quote",
              },

            ].map((l) => (

              <li key={l.label}>

                <Link
                  to={l.to}
                  params={
                    district
                      ? { district }
                      : undefined
                  }
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >

                  {l.label}

                </Link>

              </li>

            ))}

          </ul>

        </div>

        <div>

          <h4 className="text-sm font-semibold mb-4">

            Categories

          </h4>

          <ul className="space-y-2 text-sm">

            {(categories || []).map((c: any) => (

              <li key={c.slug}>

                <Link
                  to="/products/category/$category"
                  params={{
                    category: c.slug,
                  }}
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >

                  {c.name}

                </Link>

              </li>

            ))}

          </ul>

        </div>

        <div>

          <h4 className="text-sm font-semibold mb-4">

            Reach Us

          </h4>

          <ul className="space-y-3 text-sm text-muted-foreground">

            <li className="flex gap-2">

              <Phone className="h-4 w-4 mt-0.5 text-primary" />

              {site.phone}

            </li>

            <li className="flex gap-2">

              <Mail className="h-4 w-4 mt-0.5 text-primary" />

              {site.email}

            </li>

            <li className="flex gap-2">

              <MapPin className="h-4 w-4 mt-0.5 text-primary" />

              {
                district
                  ? district === "jaipur"
                    ? address
                    : stateName
                      ? `${city}, ${stateName}, India`
                      : `${city}, India`
                  : address
              }

            </li>

          </ul>

        </div>

      </div>

      <div className="border-t border-border">

        <div className="container mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">

          <p>

            © {new Date().getFullYear()} {site.name}. All rights reserved.

          </p>

          <div className="flex gap-5">

            <Link
              to="/privacy"
              className="hover:text-primary transition-smooth"
            >

              Privacy Policy

            </Link>

            <Link
              to="/terms"
              className="hover:text-primary transition-smooth"
            >

              Terms of Use

            </Link>

          </div>

        </div>

      </div>

    </footer>

  );

}