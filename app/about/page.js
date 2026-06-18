import "./About.css";

export default function AboutPage({ district = "" }) {
    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "";
    return (
        <main className="about-page">

            {/* Hero Section */}
            <section className="about-hero">

                <div className="about-hero-content">

                    <span className="about-tag">
                        ABOUT HUMAN BIOMEDICAL
                    </span>

                    <h1>
                        Delivering Advanced Biomedical &
                        Diagnostic Equipment Solutions

                        {city && (
                            <>
                                <br />
                                In {city}
                            </>
                        )}
                    </h1>

                    <p>
                        Trusted supplier of laboratory, diagnostic and
                        hospital equipment helping healthcare institutions
                        achieve excellence through reliable technology

                        {city && ` in ${city}`}.
                    </p>

                </div>

            </section>

            {/* Company Story */}

            <section className="story-section">

                <div className="story-image">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200"
                        alt="Laboratory"
                    />
                </div>

                <div className="story-content">

                    <span>WHO WE ARE</span>

                    <h2>
                        Empowering Healthcare Through Technology
                    </h2>

                    <p>
                        Human Biomedical specializes in supplying
                        advanced laboratory analyzers, diagnostic
                        systems and hospital equipment to healthcare
                        institutions across

                        {city ? ` ${city}` : " India"}.
                    </p>

                    <p>
                        Our focus is on delivering reliable products,
                        exceptional service and long-term customer
                        relationships.
                    </p>

                </div>

            </section>

            {/* Stats */}

            <section className="stats-section">

                <div className="stat-card">
                    <h3>500+</h3>
                    <p>Products</p>
                </div>

                <div className="stat-card">
                    <h3>700+</h3>
                    <p>Districts Covered</p>
                </div>

                <div className="stat-card">
                    <h3>10+</h3>
                    <p>Years Experience</p>
                </div>

                <div className="stat-card">
                    <h3>24/7</h3>
                    <p>Support</p>
                </div>

            </section>

            {/* Why Choose Us */}

            <section className="why-section">

                <div className="section-heading">
                    <span>WHY CHOOSE US</span>
                    <h2>Why Healthcare Professionals Trust Us</h2>
                </div>

                <div className="why-grid">

                    <div className="why-card">
                        <h3>Genuine Products</h3>
                        <p>Reliable biomedical equipment from trusted manufacturers.</p>
                    </div>

                    <div className="why-card">
                        <h3>Expert Support</h3>
                        <p>Professional guidance and technical assistance.</p>
                    </div>

                    <div className="why-card">
                        <h3>Fast Delivery</h3>
                        <p>PAN India supply network with timely dispatch.</p>
                    </div>

                    <div className="why-card">
                        <h3>Installation</h3>
                        <p>Support for installation and setup assistance.</p>
                    </div>

                    <div className="why-card">
                        <h3>Competitive Pricing</h3>
                        <p>Best value without compromising quality.</p>
                    </div>

                    <div className="why-card">
                        <h3>Long-Term Partnership</h3>
                        <p>Focused on customer satisfaction and trust.</p>
                    </div>

                </div>

            </section>

            {/* Mission */}

            <section className="mission-section">

                <div className="mission-card">
                    <h3>Mission</h3>
                    <p>
                        Deliver dependable biomedical solutions and
                        exceptional customer support.
                    </p>
                </div>

                <div className="mission-card">
                    <h3>Vision</h3>
                    <p>
                        Become India's most trusted biomedical
                        technology partner.
                    </p>
                </div>

                <div className="mission-card">
                    <h3>Values</h3>
                    <p>
                        Quality, Innovation, Integrity and Customer Success.
                    </p>
                </div>

            </section>

        </main>
    );
}