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
                    Trusted Biomedical Equipment Supplier
                </span>

                <h1>
                    {heroData?.title}
                    {city ? ` In ${city}` : " In India"}
                </h1>

                <p>
                    {heroData?.description}
                </p>

                <div className="hero-buttons">
                    <Link
                        className="primary-btn"
                        href={district ? `/${district}/contact` : "/contact"}
                    >
                        {heroData?.button1Text}
                    </Link>

                    <Link
                        className="secondary-btn"
                        href={district ? `/${district}/items` : "/items"}
                    >
                        {heroData?.button2Text}
                    </Link>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        ✓ Genuine Products
                    </div>
                    <div className="feature-item">
                        ✓ PAN India Delivery
                    </div>
                    <div className="feature-item">
                        ✓ Technical Support
                    </div>
                </div>
            </div>

            <div className="hero-right">
                <div className="hero-image-box" style={{ position: "relative", width: "100%", height: "100%", minHeight: "350px" }}>
                    <Image
                        src={
                            heroData?.imageUrl ||
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                        }
                        alt="Medical Laboratory"
                        fill
                        sizes="(max-width: 992px) 100vw, 50vw"
                        priority
                        style={{ objectFit: "cover", borderRadius: "24px" }}
                    />
                </div>
            </div>
        </section>
    );
}