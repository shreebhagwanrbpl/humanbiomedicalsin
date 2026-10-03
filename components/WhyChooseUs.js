"use client";

import "./WhyChooseUs.css";
import { FaCheckCircle, FaTools, FaTruck, FaTag } from "react-icons/fa";

export default function WhyChooseUs() {
    return (
        <section className="why-section">
            <div className="why-header">
                <span className="why-badge">WHY CHOOSE US</span>
                <h2>Why Choose Human Biomedical</h2>
                <p>
                    We provide trusted biomedical solutions with genuine quality products, certified warranties, and reliable technical assistance.
                </p>
            </div>

            <div className="why-grid">
                <div className="why-card">
                    <div className="why-icon-box"><FaCheckCircle /></div>
                    <h3>Genuine Products</h3>
                    <p>
                        100% authentic biomedical equipment sourced directly from certified global manufacturers.
                    </p>
                </div>

                <div className="why-card">
                    <div className="why-icon-box"><FaTools /></div>
                    <h3>Technical Support</h3>
                    <p>
                        Expert biomedical engineers ready for on-site installation, calibration, and AMC services.
                    </p>
                </div>

                <div className="why-card">
                    <div className="why-icon-box"><FaTruck /></div>
                    <h3>Fast Delivery</h3>
                    <p>
                        Rapid PAN-India distribution network ensuring prompt delivery of analyzers and test kits.
                    </p>
                </div>

                <div className="why-card">
                    <div className="why-icon-box"><FaTag /></div>
                    <h3>Best Pricing</h3>
                    <p>
                        Competitive wholesale and direct pricing without compromising on reliability and quality.
                    </p>
                </div>
            </div>
        </section>
    );
}
