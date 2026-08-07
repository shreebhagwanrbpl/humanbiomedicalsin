"use client";
import "./CTA.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

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
                    Human Biomedical LLP
                </span>

                <h2>
                    Looking For Reliable Biomedical Equipment?
                </h2>

                <p>
                    Get high-quality laboratory analyzers, diagnostic systems,
                    hospital instruments and biomedical equipment with expert installation,
                    warranty support, and competitive pricing across India.
                </p>

                <div className="cta-buttons">
                    <a
                        href="tel:+919251598228"
                        className="cta-call-btn"
                    >
                        <FaPhoneAlt /> Call +91 9251598228
                    </a>

                    <a
                        href="https://wa.me/919251598228?text=Hello%20Human%20Biomedical%20LLP,%20I%20want%20to%20enquire%20about%20biomedical%20equipment."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-whatsapp-btn"
                    >
                        <FaWhatsapp /> WhatsApp Us
                    </a>

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