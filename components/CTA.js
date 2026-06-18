"use client";
import "./CTA.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function CTA() {
    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const staticRoutes = [
        "about",
        "items",
        "services",
        "contact"
    ];

    const district =
        pathParts[0] &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";
    return (
        <section className="cta-section">

            <div className="cta-content">

                <span className="cta-badge">
                    Human Biomedical
                </span>

                <h2>
                    Looking For Reliable Biomedical Equipment?
                </h2>

                <p>
                    Get high-quality laboratory analyzers, diagnostic systems,
                    hospital instruments and biomedical equipment with expert
                    support and competitive pricing.
                </p>

                <div className="cta-buttons">
                    <Link
                        href={
                            district
                                ? `/${district}/items`
                                : "/items"
                        }
                        className="cta-primary"
                    >
                        View Products
                    </Link>

                    <Link
                        href={
                            district
                                ? `/${district}/contact`
                                : "/contact"
                        }
                        className="cta-secondary"
                    >
                        Contact Us
                    </Link>

                </div>

            </div>

        </section>
    );
}