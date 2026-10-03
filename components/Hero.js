"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./Hero.css";
import { FaPhoneAlt, FaCheckCircle, FaAward, FaShieldAlt } from "react-icons/fa";

export default function Hero({ heroData: initialHeroData, city: propCity, district: propDistrict }) {
    const [heroData, setHeroData] = useState(initialHeroData || null);
    const [contactInfo, setContactInfo] = useState([]);

    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = propDistrict || (pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "");
    const city = propCity || (district ? district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");

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
                console.error("Error fetching hero/contact data:", err);
            }
        };

        fetchHeroAndContact();
        return () => { isMounted = false; };
    }, [initialHeroData]);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call") ||
            item.label?.toLowerCase().includes("contact")
    );
    const rawPhone = phoneItem?.value;
    const phoneNumber = Array.isArray(rawPhone) ? rawPhone.join(", ") : (rawPhone != null ? String(rawPhone) : "");

    const titleText = heroData?.title
        ? (heroData.title + (city ? " in " + city : ""))
        : (city ? "Precision Diagnostic Systems & Laboratory Equipment in " + city : "Precision Diagnostic Systems, Clinical Analyzers & Laboratory Instruments");

    const descriptionText = heroData?.description ||
        "Discover our extensive selection of clinical laboratory analyzers, diagnostic test kits, and medical instrumentation with expert nationwide service.";

    const button1Text = heroData?.button1Text || "View Products";
    const button2Text = heroData?.button2Text || "Contact Us";

    return (
        <section className="hero">
            <div className="hero-left">
                <span className="hero-badge">
                    <FaAward style={{ marginRight: 6 }} /> India's Leading Biomedical Equipment Supplier
                </span>

                <h1>{titleText}</h1>

                <p>{descriptionText}</p>

                <div className="hero-buttons">
                    {phoneNumber && (
                        <a
                            className="hero-call-btn"
                            href={"tel:" + (Array.isArray(rawPhone) ? rawPhone[0] : phoneNumber)}
                        >
                            <FaPhoneAlt /> Call {phoneNumber}
                        </a>
                    )}

                    <Link
                        className="primary-btn"
                        href={district ? "/" + district + "/items" : "/items"}
                    >
                        {button1Text}
                    </Link>

                    <Link
                        className="secondary-btn"
                        href={district ? "/" + district + "/contact" : "/contact"}
                    >
                        {button2Text}
                    </Link>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        <FaCheckCircle className="feat-icon" /> Genuine Certified Brands
                    </div>
                    <div className="feature-item">
                        <FaCheckCircle className="feat-icon" /> Express Delivery
                    </div>
                    <div className="feature-item">
                        <FaShieldAlt className="feat-icon" /> Warranty & Calibration Support
                    </div>
                </div>
            </div>

            <div className="hero-right">
                <div className="hero-image-box">
                    <img
                        src={heroData?.imageUrl || "/biomedical-hero.jpg"}
                        alt="Biomedical Equipment Laboratory Analyzer"
                        className="hero-img-element"
                        loading="eager"
                    />
                    <div className="hero-floating-card">
                        <span className="card-number">100%</span>
                        <span className="card-label">Certified Equipment</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
