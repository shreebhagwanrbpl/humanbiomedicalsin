"use client";

import "./CTA.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function CTA() {
    const [contactInfo, setContactInfo] = useState([]);
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

    useEffect(() => {
        const loadContact = async () => {
            try {
                const res = await fetch("/api/site-data?type=contact");
                if (res.ok) {
                    const json = await res.json();
                    if (json?.data) {
                        const info = Array.isArray(json.data.contactInfo)
                            ? json.data.contactInfo
                            : Array.isArray(json.data)
                            ? json.data
                            : [];
                        setContactInfo(info);
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };

        loadContact();
    }, []);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call") ||
            item.label?.toLowerCase().includes("contact")
    );
    const phoneNumber = phoneItem?.value || "";
    const cleanPhoneForWa = phoneNumber.replace(/[^0-9]/g, "");

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
                    {phoneNumber && (
                        <a
                            href={`tel:${phoneNumber}`}
                            className="cta-call-btn"
                        >
                            <FaPhoneAlt /> Call {phoneNumber}
                        </a>
                    )}

                    {cleanPhoneForWa && (
                        <a
                            href={`https://wa.me/${cleanPhoneForWa}?text=Hello%20Human%20Biomedical%20LLP,%20I%20want%20to%20enquire%20about%20biomedical%20equipment.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-whatsapp-btn"
                        >
                            <FaWhatsapp /> WhatsApp Us
                        </a>
                    )}

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