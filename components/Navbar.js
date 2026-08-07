"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

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
        pathParts.length > 0 &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const makeLink = (path = "") => {
        return district
            ? `/${district}${path}`
            : path || "/";
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar-wrapper">
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="top-info">
                        <span className="top-item">
                            <FaPhoneAlt className="top-icon" />
                            <span>Call: </span>
                            <a href="tel:+919251598228">+91 9251598228</a>
                            <span className="divider">|</span>
                            <a href="tel:+918112279728">+91 8112279728</a>
                        </span>
                        <span className="top-item email-item">
                            <FaEnvelope className="top-icon" />
                            <a href="mailto:humanbiomedicalsin@gmail.com">humanbiomedicalsin@gmail.com</a>
                        </span>
                    </div>
                    <div className="top-right">
                        <span className="top-badge">PAN India Delivery & Support</span>
                    </div>
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <nav className="navbar">
                <div className="navbar-container">

                    {/* LOGO */}
                    <Link
                        href={makeLink("")}
                        className="logo"
                        onClick={closeMenu}
                    >
                        <Image
                            src="/humanlogo.png"
                            alt="Human Biomedical"
                            width={220}
                            height={60}
                            priority
                        />
                    </Link>

                    {/* HAMBURGER */}
                    <button
                        className={`hamburger ${menuOpen ? "active" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* NAVIGATION */}
                    <div className={`nav-links ${menuOpen ? "active" : ""}`}>

                        <Link href={makeLink("")} onClick={closeMenu}>
                            Home
                        </Link>

                        <Link href={makeLink("/about")} onClick={closeMenu}>
                            About Us
                        </Link>

                        <Link href={makeLink("/items")} onClick={closeMenu}>
                            Products
                        </Link>

                        <Link href={makeLink("/services")} onClick={closeMenu}>
                            Services
                        </Link>

                        <Link href={makeLink("/contact")} onClick={closeMenu}>
                            Contact
                        </Link>

                        <div className="mobile-contact-numbers">
                            <a href="tel:+919251598228" className="phone-btn-link">
                                📞 +91 9251598228
                            </a>
                            <a href="tel:+918112279728" className="phone-btn-link">
                                📞 +91 8112279728
                            </a>
                        </div>

                        <Link
                            href={makeLink("/contact")}
                            className="quote-btn mobile-btn"
                            onClick={closeMenu}
                        >
                            Get Quote
                        </Link>

                    </div>

                    {/* DESKTOP BUTTONS */}
                    <div className="desktop-actions">
                        <a href="tel:+919251598228" className="nav-call-btn">
                            <FaPhoneAlt /> +91 9251598228
                        </a>
                        <Link
                            href={makeLink("/contact")}
                            className="quote-btn desktop-btn"
                        >
                            Get Quote
                        </Link>
                    </div>

                </div>
            </nav>
        </header>
    );
}