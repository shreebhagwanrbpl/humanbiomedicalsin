"use client";

import "./Stats.css";
import { FaMicroscope, FaCity, FaCalendarAlt, FaHeadset } from "react-icons/fa";

export default function Stats() {
    return (
        <section className="stats">
            <div className="stat-card">
                <div className="stat-icon-wrap"><FaMicroscope /></div>
                <h2>500+</h2>
                <p>Products & Analyzers</p>
            </div>

            <div className="stat-card">
                <div className="stat-icon-wrap"><FaCity /></div>
                <h2>100+</h2>
                <p>Cities Served</p>
            </div>

            <div className="stat-card">
                <div className="stat-icon-wrap"><FaCalendarAlt /></div>
                <h2>10+</h2>
                <p>Years Experience</p>
            </div>

            <div className="stat-card">
                <div className="stat-icon-wrap"><FaHeadset /></div>
                <h2>24/7</h2>
                <p>Engineer Support</p>
            </div>
        </section>
    );
}
