"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaBars, FaTimes, FaShieldAlt } from "react-icons/fa";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState([]);

    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "";
    const prefix = district ? `/${district}` : "";

    useEffect(() => {
        let isMounted = true;
        const loadContact = async () => {
            try {
                const res = await fetch("/api/site-data?type=contact");
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted && json?.data) {
                        const info = Array.isArray(json.data.contactInfo)
                            ? json.data.contactInfo
                            : Array.isArray(json.data)
                            ? json.data
                            : [];
                        setContactInfo(info);
                    }
                }
            } catch (err) {
                // Silently ignore
            }
        };
        loadContact();
        return () => { isMounted = false; };
    }, []);

    const phoneItem = contactInfo.find(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call")
    );
    const rawPhone = phoneItem?.value;
    const phoneDisplay = Array.isArray(rawPhone) ? rawPhone[0] : (rawPhone != null ? String(rawPhone) : "9251616952");
    const cleanPhone = phoneDisplay.replace(/[^0-9]/g, "");

    const emailItem = contactInfo.find((item) => item.label?.toLowerCase().includes("email"));
    const emailDisplay = emailItem?.value || "sales@humanbiomedicals.in";

    return (
        <header className="site-header">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="top-left">
                        <span className="top-badge">
                            <FaShieldAlt style={{ marginRight: 6 }} /> Certified Biomedical Supplier
                        </span>
                        <span className="top-text">PAN India Installation & AMC Support</span>
                    </div>

                    <div className="top-right">
                        {phoneDisplay && (
                            <a href={`tel:${phoneDisplay}`} className="top-link">
                                <FaPhoneAlt /> {phoneDisplay}
                            </a>
                        )}
                        {emailDisplay && (
                            <a href={`mailto:${emailDisplay}`} className="top-link">
                                <FaEnvelope /> {emailDisplay}
                            </a>
                        )}
                        {cleanPhone && (
                            <a
                                href={`https://wa.me/${cleanPhone}?text=Hello%20Human%20Biomedicals,%20I%20am%20interested%20in%20biomedical%20equipment.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="top-wa-btn"
                            >
                                <FaWhatsapp /> WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="main-nav">
                <div className="nav-container">
                    <Link href={prefix || "/"} className="brand-logo">
                        <div className="brand-icon">HB</div>
                        <div className="brand-text">
                            <span className="brand-title">HUMAN BIOMEDICAL</span>
                            <span className="brand-sub">Diagnostic & Laboratory Systems</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                        <li>
                            <Link
                                href={prefix || "/"}
                                className={pathname === "/" || pathname === prefix ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`${prefix}/about`}
                                className={pathname.includes("/about") ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`${prefix}/items`}
                                className={pathname.includes("/items") ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                Products Catalog
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`${prefix}/services`}
                                className={pathname.includes("/services") ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                Services & AMC
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`${prefix}/contact`}
                                className={pathname.includes("/contact") ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </li>

                        <li className="mobile-only-btn">
                            <Link
                                href={`${prefix}/contact`}
                                className="nav-quote-btn"
                                onClick={() => setMenuOpen(false)}
                            >
                                Request Quote
                            </Link>
                        </li>
                    </ul>

                    <div className="nav-actions">
                        <Link href={`${prefix}/contact`} className="nav-quote-btn desktop-only">
                            Get Quote
                        </Link>
                        <button
                            className="mobile-toggle"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
