"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import "./Hero.css";

export default function Hero({ heroData: initialHeroData, city: propCity, district: propDistrict }) {
    const [heroData, setHeroData] = useState(initialHeroData || null);
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
        if (initialHeroData) return;

        const fetchHero = async () => {
            try {
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "home"
                    )
                );

                if (snap.exists()) {
                    setHeroData(snap.data());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHero();
    }, [initialHeroData]);

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

    return (
        <section className="hero">
            <div className="hero-left">
                <span className="hero-badge">
                    🏆 India's Leading Biomedical Equipment Supplier
                </span>

                <h1>
                    {heroData?.title || "Trusted Medical & Laboratory Equipment Supplier"}
                    {city ? ` In ${city}` : " In India"}
                </h1>

                <p>
                    {heroData?.description || "Human Biomedical LLP delivers high-precision CBC machines, hematology analyzers, biochemistry systems, and diagnostic instruments with expert installation, AMC, and 24/7 technical support."}
                </p>

                <div className="hero-buttons">
                    <a
                        className="hero-call-btn"
                        href="tel:+919251598228"
                    >
                        📞 Call +91 9251598228
                    </a>

                    <Link
                        className="primary-btn"
                        href={district ? `/${district}/contact` : "/contact"}
                    >
                        {heroData?.button1Text || "Get Instant Quote"}
                    </Link>

                    <Link
                        className="secondary-btn"
                        href={district ? `/${district}/items` : "/items"}
                    >
                        {heroData?.button2Text || "Browse Products"}
                    </Link>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        ✓ 100% Genuine Brands
                    </div>
                    <div className="feature-item">
                        ✓ PAN India Express Delivery
                    </div>
                    <div className="feature-item">
                        ✓ 24/7 Technical Assistance
                    </div>
                </div>
            </div>

            <div className="hero-right">
                <div className="hero-image-box">
                    <Image
                        src={
                            heroData?.imageUrl ||
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                        }
                        alt="Biomedical Equipment Laboratory"
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