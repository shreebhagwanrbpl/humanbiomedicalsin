"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import "./Hero.css";

export default function Hero() {

    const [heroData, setHeroData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "";

    useEffect(() => {

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

    }, []);

    if (loading) {

        return (
            <section className="hero">

                <div className="hero-left">

                    <span className="hero-badge">
                    </span>

                    <h1>
                    </h1>

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

                    {city
                        ? ` In ${city}`
                        : " In India"}
                </h1>

                <p>
                    {heroData?.description}
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={() =>
                            window.location.href =
                            district
                                ? `/${district}/contact`
                                : "/contact"
                        }
                    >
                        {heroData?.button1Text}
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            window.location.href =
                            district
                                ? `/${district}/items`
                                : "/items"
                        }
                    >
                        {heroData?.button2Text}
                    </button>

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

                <div className="hero-image-box">

                    <img
                        src={
                            heroData?.imageUrl ||
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                        }
                        alt="Medical Laboratory"
                    />

                </div>

            </div>

        </section>
    );
}