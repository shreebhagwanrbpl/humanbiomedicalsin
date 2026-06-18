"use client";
import "./Services.css";
import { usePathname } from "next/navigation";
import "./Services.css";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
export default function ServicesPage() {
    const [services, setServices] = useState([]);
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
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "services"
                    )
                );

                if (snap.exists()) {
                    setServices(
                        snap.data().services || []
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <main className="services-page">

                <section className="services-hero">

                    <div className="hero-content">

                        <div className="skeleton badge-loader"></div>

                        <div className="skeleton hero-title-loader"></div>

                        <div className="skeleton hero-title-loader short"></div>

                        <div className="skeleton hero-text-loader"></div>
                        <div className="skeleton hero-text-loader"></div>
                        <div className="skeleton hero-text-loader small"></div>
                        {/* 
                        <div className="hero-buttons">

                            <div className="skeleton btn-loader"></div>

                            <div className="skeleton btn-loader"></div>

                        </div> */}

                    </div>

                </section>

                <section className="services-section">

                    <div className="section-title">

                        <div className="skeleton section-heading-loader"></div>

                        <div className="skeleton section-text-loader"></div>

                    </div>

                    <div className="services-grid">

                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                className="service-card"
                                key={item}
                            >

                                <div className="skeleton icon-loader"></div>

                                <div className="skeleton card-title-loader"></div>

                                <div className="skeleton card-text-loader"></div>

                                <div className="skeleton card-text-loader short"></div>

                            </div>
                        ))}

                    </div>

                </section>

            </main>
        );
    }
    return (
        <main className="services-page">

            {/* HERO */}

            <section className="services-hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <span className="services-badge">
                        Professional Biomedical Engineering Services
                    </span>
                    <h1>
                        Biomedical Equipment
                        <br />
                        Sales, Installation &
                        <br />
                        Maintenance Services

                        {city
                            ? ` In ${city}`
                            : " In India"}
                    </h1>

                    <p>
                        Human Biomedicals provides installation, calibration,
                        AMC, preventive maintenance, repair services and
                        technical support for diagnostic laboratories,
                        hospitals and healthcare institutions

                        {city
                            ? ` across ${city}.`
                            : " across India."}
                    </p>

                    {/* <div className="hero-buttons">
                        <button
                            className="primary-btn"
                            onClick={() =>
                                window.location.href =
                                district
                                    ? `/${district}/contact`
                                    : "/contact"
                            }
                        >
                            Request Service
                        </button>


                        <button
                            className="secondary-btn"
                            onClick={() =>
                                window.location.href =
                                district
                                    ? `/${district}/contact`
                                    : "/contact"
                            }
                        >
                            Contact Team
                        </button>
                    </div> */}

                </div>

            </section>

            {/* STATS */}


            {/* SERVICES */}

            <section className="services-section">

                <div className="section-title">

                    <h2>Our Core Services</h2>

                    <p>
                        Reliable biomedical engineering solutions designed
                        to maximize equipment performance and uptime.
                    </p>

                </div>

                <div className="services-grid">

                    {services.map((service, index) => {

                        const icons = [
                            "🏥",
                            "⚙️",
                            "🔧",
                            "📊",
                            "🛠️",
                            "👨‍🔬"
                        ];

                        return (
                            <div
                                className="service-card"
                                key={index}
                            >

                                <div className="service-icon">
                                    {icons[index % icons.length]}
                                </div>

                                <h3>
                                    {service.title}
                                </h3>

                                <p>
                                    {service.desc}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </section>

            {/* WHY CHOOSE */}

            <section className="why-section">

                <div className="section-title">

                    <h2>Why Choose Human Biomedicals?</h2>

                </div>

                <div className="why-grid">

                    <div className="why-card">
                        <h3>Certified Engineers</h3>
                        <p>
                            Experienced professionals with strong
                            biomedical engineering expertise.
                        </p>
                    </div>

                    <div className="why-card">
                        <h3>Quick Response</h3>
                        <p>
                            Fast support and on-site assistance
                            across multiple locations.
                        </p>
                    </div>

                    <div className="why-card">
                        <h3>Genuine Parts</h3>
                        <p>
                            High-quality spare parts ensuring
                            long equipment life.
                        </p>
                    </div>

                    <div className="why-card">
                        <h3>Nationwide Coverage</h3>
                        <p>
                            Reliable biomedical support services
                            throughout India.
                        </p>
                    </div>

                </div>

            </section>

            {/* PROCESS */}

            <section className="process-section">

                <h2>Our Service Process</h2>

                <div className="process-grid">

                    <div className="process-card">
                        <span>01</span>
                        <h3>Requirement Analysis</h3>
                    </div>

                    <div className="process-card">
                        <span>02</span>
                        <h3>Equipment Assessment</h3>
                    </div>

                    <div className="process-card">
                        <span>03</span>
                        <h3>Execution & Installation</h3>
                    </div>

                    <div className="process-card">
                        <span>04</span>
                        <h3>Support & Maintenance</h3>
                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="services-cta">

                <h2>
                    Looking For Professional Biomedical Support?
                </h2>

                <p>
                    Get expert assistance for equipment installation,
                    calibration, repair and AMC services.
                </p>

                <button
                    className="secondary-btn"
                    onClick={() =>
                        window.location.href =
                        district
                            ? `/${district}/contact`
                            : "/contact"
                    }
                >
                    Get Free Consultation
                </button>

            </section>

        </main >
    );
}