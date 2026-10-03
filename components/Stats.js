"use client";

import "./Stats.css";
import { FaMicroscope, FaCity, FaCalendarAlt, FaHeadset } from "react-icons/fa";

export default function Stats() {
    return (
        <section className="stats-section">
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon-circle"><FaMicroscope /></div>
                    <div className="stat-details">
                        <h3>500+</h3>
                        <p>Diagnostic Analyzers</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-circle"><FaCity /></div>
                    <div className="stat-details">
                        <h3>100+</h3>
                        <p>Cities Across India</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-circle"><FaCalendarAlt /></div>
                    <div className="stat-details">
                        <h3>10+</h3>
                        <p>Years Experience</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-circle"><FaHeadset /></div>
                    <div className="stat-details">
                        <h3>24/7</h3>
                        <p>Engineer Support</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
