"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./Hero.css";
import { FaPhoneAlt, FaWhatsapp, FaCheckCircle, FaAward, FaShieldAlt, FaMicroscope } from "react-icons/fa";

export default function Hero({ heroData: initialHeroData, city: propCity, district: propDistrict }) {
    const [heroData, setHeroData] = useState(initialHeroData || null);
    const [contactInfo, setContactInfo] = useState([]);

    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = propDistrict || (pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "");
    const city = propCity || (district ? district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");
    const prefix = district ? `/${district}` : "";

    useEffect(() => {
        let isMounted = true;
        const fetchHeroAndContact = async () => {
            try {
                if (!initialHeroData) {
                    const res = await fetch("/api/site-data?type=home");
                    if (res.ok) {
                        const json = await res.json();
                        if (isMounted && json?.data) {
                            setHeroData(json.data);
                        }
                    }
                }

                const contactRes = await fetch("/api/site-data?type=contact");
                if (contactRes.ok) {
                    const contactJson = await contactRes.json();
                    if (isMounted && contactJson?.data) {
                        const info = Array.isArray(contactJson.data.contactInfo)
                            ? contactJson.data.contactInfo
                            : Array.isArray(contactJson.data)
                                ? contactJson.data
                                : [];
                        setContactInfo(info);
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };

        fetchHeroAndContact();
        return () => { isMounted = false; };
    }, [initialHeroData]);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call")
    );
    const rawPhone = phoneItem?.value;
    const phoneNumber = "+91 8112279728";
    const cleanPhoneForWa = "91+91 8112279728";

    const titleText = heroData?.title
        ? (heroData.title + (city ? " in " + city : ""))
        : (city ? "Precision Diagnostic Systems & Laboratory Equipment in " + city : "Precision Diagnostic Systems, Clinical Analyzers & Laboratory Instruments");

    const descriptionText = heroData?.description ||
        "Discover our extensive selection of clinical laboratory analyzers, diagnostic test kits, and medical instrumentation. Human Biomedicals ensures accurate test results, unmatched equipment reliability, and dedicated nationwide service.";

    return (
        <section className="hero-section">
            <div className="hero-container">
                {/* Left Content */}
                <div className="hero-left">
                    <div className="hero-badge-pill">
                        <FaAward className="badge-icon" /> India's Leading Biomedical Equipment Supplier
                    </div>

                    <h1 className="hero-title">{titleText}</h1>

                    <p className="hero-description">{descriptionText}</p>

                    <div className="hero-action-buttons">
                        {phoneNumber && (
                            <a
                                className="hero-btn-phone"
                                href="tel:+91+91 8112279728"
                            >
                                <FaPhoneAlt /> Call {phoneNumber}
                            </a>
                        )}

                        {cleanPhoneForWa && (
                            <a
                                className="hero-btn-wa"
                                href={`https://wa.me/${cleanPhoneForWa}?text=Hello%20Human%20Biomedicals,%20I%20want%20to%20enquire%20about%20biomedical%20equipment.`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp /> WhatsApp Us
                            </a>
                        )}

                        <Link
                            className="hero-btn-catalog"
                            href={`${prefix}/items`}
                        >
                            <FaMicroscope /> View Products
                        </Link>
                    </div>

                    <div className="hero-feature-pills">
                        <div className="feature-pill">
                            <FaCheckCircle className="pill-icon" /> 100% Genuine Certified
                        </div>
                        <div className="feature-pill">
                            <FaCheckCircle className="pill-icon" /> Express PAN-India Dispatch
                        </div>
                        <div className="feature-pill">
                            <FaShieldAlt className="pill-icon" /> Warranty & AMC Support
                        </div>
                    </div>
                </div>

                {/* Right Image Showcase */}
                <div className="hero-right">
                    <div className="hero-image-card">
                        <div className="hero-image-wrapper">
                            <img
                                src={heroData?.imageUrl || "/biomedical-hero.jpg"}
                                alt="Biomedical Equipment Laboratory Analyzer"
                                className="hero-main-img"
                                loading="eager"
                            />
                        </div>

                        {/* Floating Trust Badges */}
                        <div className="floating-badge badge-top-right">
                            <span className="badge-val">100%</span>
                            <span className="badge-lbl">Certified Equipment</span>
                        </div>

                        <div className="floating-badge badge-bottom-left">
                            <span className="badge-val">24/7</span>
                            <span className="badge-lbl">Engineer Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
