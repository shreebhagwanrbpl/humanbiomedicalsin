"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";
import Image from "next/image";

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
        <header className="navbar">
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
                <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

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

                    <Link
                        href={makeLink("/contact")}
                        className="quote-btn mobile-btn"
                        onClick={closeMenu}
                    >
                        Get Quote
                    </Link>

                </nav>

                {/* DESKTOP BUTTON */}
                <Link
                    href={makeLink("/contact")}
                    className="quote-btn desktop-btn"
                >
                    Get Quote
                </Link>

            </div>
        </header>
    );
}