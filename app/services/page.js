import "./Services.css";
import Link from "next/link";
import { getServicesData } from "../../lib/db-server";

export const revalidate = 3600;

export default async function ServicesPage({ district = "" }) {
    const services = await getServicesData();

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";

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

                </div>

            </section>

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

                <Link
                    className="secondary-btn"
                    href={
                        district
                            ? `/${district}/contact`
                            : "/contact"
                    }
                >
                    Get Free Consultation
                </Link>

            </section>

        </main >
    );
}