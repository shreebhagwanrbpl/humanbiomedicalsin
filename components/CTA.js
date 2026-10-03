"use client";

import "./CTA.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPhoneAlt, FaWhatsapp, FaArrowRight, FaShieldAlt } from "react-icons/fa";

export default function CTA() {
    const [contactInfo, setContactInfo] = useState([]);
    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "";
    const prefix = district ? `/${district}` : "";

    useEffect(() => {
        let isMounted = true;
        const loadContact = async () => {
            try {
                const res = await fetch("/api/site-data?type=contact");
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted && json?.data) {
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
        return () => { isMounted = false; };
    }, []);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call")
    );
    const rawPhone = phoneItem?.value;
    const phoneNumber = Array.isArray(rawPhone) ? rawPhone[0] : (rawPhone != null ? String(rawPhone) : "9251616952");
    const cleanPhoneForWa = phoneNumber ? String(phoneNumber).replace(/[^0-9]/g, "") : "9251616952";

    return (
        <section className="cta-banner-section">
            <div className="cta-banner-card">
                <span className="cta-trust-badge">
                    <FaShieldAlt style={{ marginRight: 6 }} /> Human Biomedical LLP
                </span>

                <h2 className="cta-headline">
                    Looking For Reliable Biomedical Equipment?
                </h2>

                <p className="cta-subtext">
                    Get high-quality laboratory analyzers, diagnostic systems, hospital instruments, and consumables with expert on-site installation, warranty support, and competitive pricing across India.
                </p>

                <div className="cta-action-group">
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
                            className="cta-wa-btn"
                        >
                            <FaWhatsapp /> WhatsApp Us
                        </a>
                    )}

                    <Link
                        href={`${prefix}/items`}
                        className="cta-primary-btn"
                    >
                        View Products <FaArrowRight />
                    </Link>

                    <Link
                        href={`${prefix}/contact`}
                        className="cta-secondary-btn"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
