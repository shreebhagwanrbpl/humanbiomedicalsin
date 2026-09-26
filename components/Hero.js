"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./Hero.css";

export default function Hero({ heroData: initialHeroData, city: propCity, district: propDistrict }) {
    const [heroData, setHeroData] = useState(initialHeroData || null);
    const [contactInfo, setContactInfo] = useState([]);
    const [loading, setLoading] = useState(!initialHeroData);

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

    const clientDistrict =
        pathParts[0] &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const clientCity = clientDistrict
        ? clientDistrict
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "";

    const district = propDistrict !== undefined ? propDistrict : clientDistrict;
    const city = propCity !== undefined ? propCity : clientCity;

    useEffect(() => {
        const fetchHeroAndContact = async () => {
            try {
                if (!initialHeroData) {
                    const res = await fetch("/api/site-data?type=home");
                    if (res.ok) {
                        const json = await res.json();
                        if (json?.data) {
                            setHeroData(json.data);
                        }
                    }
                }

                const contactRes = await fetch("/api/site-data?type=contact");
                if (contactRes.ok) {
                    const contactJson = await contactRes.json();
                    if (contactJson?.data) {
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
            } finally {
                setLoading(false);
            }
        };

        fetchHeroAndContact();
    }, [initialHeroData]);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call") ||
            item.label?.toLowerCase().includes("contact")
    );
    const phoneNumber = phoneItem?.value || "";

    if (loading) {
        return (
            <section className="hero">
                <div className="hero-left">
                    <span className="hero-badge"></span>
                    <h1></h1>
                    <div className="skeleton text-loader"></div>
                    <div className="skeleton text-loader"></div>
                    <div className="skeleton text-loader small"></div>
                    <div className="hero-buttons">
                        <div className="skeleton btn-loader"></div>
                        <div className="skeleton btn-loader"></div>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="skeleton image-loader"></div>
                </div>
            </section>
        );
    }

    const titleText = heroData?.title
        ? `${heroData.title}${city ? ` In ${city}` : ""}`
        : (city ? `Biomedical Equipment Supplier In ${city}` : "");

    return (
        <section className="hero">
            <div className="hero-left">
                <span className="hero-badge">
                    🏆 India's Leading Biomedical Equipment Supplier
                </span>

                {titleText && <h1>{titleText}</h1>}

                {heroData?.description && <p>{heroData.description}</p>}

                <div className="hero-buttons">
                    {phoneNumber && (
                        <a
                            className="hero-call-btn"
                            href={`tel:${phoneNumber}`}
                        >
                            📞 Call {phoneNumber}
                        </a>
                    )}

                    {heroData?.button1Text && (
                        <Link
                            className="primary-btn"
                            href={district ? `/${district}/contact` : "/contact"}
                        >
                            {heroData.button1Text}
                        </Link>
                    )}

                    {heroData?.button2Text && (
                        <Link
                            className="secondary-btn"
                            href={district ? `/${district}/items` : "/items"}
                        >
                            {heroData.button2Text}
                        </Link>
                    )}
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        ✓ Genuine Certified Brands
                    </div>
                    <div className="feature-item">
                        ✓ Express Delivery
                    </div>
                    <div className="feature-item">
                        ✓ Technical Assistance
                    </div>
                </div>
            </div>

            <div className="hero-right">
                <div className="hero-image-box">
                    <Image
                        src={
                            heroData?.imageUrl ||
                            "/biomedical-hero.jpg"
                        }
                        alt="Biomedical Equipment Laboratory Analyzer"
                        fill
                        sizes="(max-width: 992px) 100vw, 50vw"
                        priority
                        style={{ objectFit: "cover", borderRadius: "20px" }}
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