"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./Navbar.css";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState([]);

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

    useEffect(() => {
        const loadContact = async () => {
            try {
                const res = await fetch("/api/site-data?type=contact");
                if (res.ok) {
                    const json = await res.json();
                    if (json?.data) {
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
    }, []);

    const email = contactInfo.find(
        (item) => item.label?.toLowerCase() === "email"
    )?.value;

    const phoneList = contactInfo.filter(
        (item) =>
            item.label?.toLowerCase().includes("phone") ||
            item.label?.toLowerCase().includes("mobile") ||
            item.label?.toLowerCase().includes("call") ||
            item.label?.toLowerCase().includes("contact")
    );

    return (
        <header className="navbar-wrapper">
            {/* TOP BAR */}
            {(phoneList.length > 0 || email) && (
                <div className="top-bar">
                    <div className="top-bar-container">
                        <div className="top-info">
                            {phoneList.length > 0 && (
                                <span className="top-item">
                                    <FaPhoneAlt className="top-icon" />
                                    <span>Call: </span>
                                    {phoneList.map((p, idx) => (
                                        <span key={idx}>
                                            {idx > 0 && <span className="divider">|</span>}
                                            <a href={`tel:${p.value}`}>{p.value}</a>
                                        </span>
                                    ))}
                                </span>
                            )}
                            {email && (
                                <span className="top-item email-item">
                                    <FaEnvelope className="top-icon" />
                                    <a href={`mailto:${email}`}>{email}</a>
                                </span>
                            )}
                        </div>
                        <div className="top-right">
                            <span className="top-badge">PAN India Delivery & Support</span>
                        </div>
                    </div>
                </div>
            )}

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

                        {phoneList.length > 0 && (
                            <div className="mobile-contact-numbers">
                                {phoneList.map((p, idx) => (
                                    <a key={idx} href={`tel:${p.value}`} className="phone-btn-link">
                                        📞 {p.value}
                                    </a>
                                ))}
                            </div>
                        )}

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
                        {phoneList.length > 0 && (
                            <a href={`tel:${phoneList[0].value}`} className="nav-call-btn">
                                <FaPhoneAlt /> {phoneList[0].value}
                            </a>
                        )}
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