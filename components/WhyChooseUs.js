"use client";

import "./WhyChooseUs.css";
import { FaCheckCircle, FaTools, FaTruck, FaTag, FaShieldAlt } from "react-icons/fa";

export default function WhyChooseUs() {
    return (
        <section className="why-us-section">
            <div className="why-us-header">
                <span className="why-us-badge">TRUSTED HEALTHCARE PARTNER</span>
                <h2>Why Choose Human Biomedical</h2>
                <p>
                    We deliver turnkey biomedical solutions with 100% genuine equipment, certified engineer installation, prompt delivery, and dedicated customer care.
                </p>
            </div>

            <div className="why-us-grid">
                <div className="why-benefit-card">
                    <div className="benefit-icon-box"><FaCheckCircle /></div>
                    <h3>100% Genuine Products</h3>
                    <p>Directly sourced from certified manufacturers with verified batch quality and warranties.</p>
                </div>

                <div className="why-benefit-card">
                    <div className="benefit-icon-box"><FaTools /></div>
                    <h3>Expert Technical Support</h3>
                    <p>Qualified biomedical engineers for on-site installation, calibration, validation, and AMC support.</p>
                </div>

                <div className="why-benefit-card">
                    <div className="benefit-icon-box"><FaTruck /></div>
                    <h3>Rapid Nationwide Delivery</h3>
                    <p>Robust logistics network guaranteeing safe and rapid transit of sensitive laboratory instruments.</p>
                </div>

                <div className="why-benefit-card">
                    <div className="benefit-icon-box"><FaTag /></div>
                    <h3>Transparent Direct Pricing</h3>
                    <p>Cost-effective pricing and tailored financing options for hospitals, clinics, and diagnostic labs.</p>
                </div>
            </div>
        </section>
    );
}
