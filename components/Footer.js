"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
    const [contactInfo, setContactInfo] = useState([]);
    const [districtData, setDistrictData] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

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
        pathParts[0] &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const prefix = district
        ? `/${district}`
        : "";

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactRes = await fetch("/api/site-data?type=contact");
                if (contactRes.ok) {
                    const contactJson = await contactRes.json();
                    if (contactJson?.data) {
                        const info = Array.isArray(contactJson.data.contactInfo)
                            ? contactJson.data.contactInfo
                            : Array.isArray(contactJson.data)
                                ? contactJson.data
                                : [];
                        setContactInfo(info);
                    }
                }

                if (district && district.toLowerCase() !== "jaipur") {
                    const districtRes = await fetch(`/api/site-data?type=districts&district=${encodeURIComponent(district)}`);
                    if (districtRes.ok) {
                        const districtJson = await districtRes.json();
                        if (districtJson?.data) {
                            setDistrictData(districtJson.data);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading footer data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [district]);

    const email =
        contactInfo.find(
            item =>
                item.label?.toLowerCase() === "email"
        )?.value || "";

    const address =
        contactInfo.find(
            item =>
                item.label?.toLowerCase() === "address"
        )?.value || "";

    const phoneList =
        contactInfo.filter(
            item =>
                item.label?.toLowerCase().includes("phone") ||
                item.label?.toLowerCase().includes("mobile") ||
                item.label?.toLowerCase().includes("call") ||
                item.label?.toLowerCase().includes("contact")
        );

    const displayAddress =
        !district ||
            district.toLowerCase() === "jaipur"
            ? address
            : (districtData?.district || city ? `${districtData?.district || city}, ${districtData?.state || ""}, India` : address);

    if (loading) {
        return (
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-about">
                        <div className="skeleton footer-title-loader"></div>
                        <div className="skeleton footer-text-loader"></div>
                        <div className="skeleton footer-text-loader"></div>
                        <div className="skeleton footer-text-loader short"></div>
                    </div>
                    <div className="footer-links">
                        <div className="skeleton footer-heading-loader"></div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton footer-link-loader"></div>
                        ))}
                    </div>
                    <div className="footer-contact">
                        <div className="skeleton footer-heading-loader"></div>
                        <div className="skeleton footer-contact-loader"></div>
                        <div className="skeleton footer-contact-loader"></div>
                        <div className="skeleton footer-contact-loader"></div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="skeleton footer-bottom-loader"></div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <div style={{ marginBottom: "16px" }}>
                        <img src="/humanlogo.png" alt="Human Biomedicals" style={{ height: "48px", width: "auto", objectFit: "contain", background: "white", padding: "4px 8px", borderRadius: "8px" }} />
                    </div>
                    <h2 style={{ fontSize: "22px" }}>Human Biomedical LLP</h2>
                    <p>
                        India's trusted supplier of laboratory, diagnostic, and hospital equipment.
                        We deliver authentic biomedical solutions, installation support, calibration, AMC,
                        and technical assistance across India.
                    </p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <Link href={prefix || "/"}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={`${prefix}/about`}>
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href={`${prefix}/items`}>
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href={`${prefix}/services`}>
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link href={`${prefix}/contact`}>
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact Info</h4>
                    <p>📞 <a href="tel:+91+91 8112279728" style={{ color: "inherit", textDecoration: "none" }}>+91 8112279728</a></p>
                    {email ? (
                        <p>
                            📧 <a href={`mailto:${email}`} style={{ color: "inherit", textDecoration: "none" }}>{email}</a>
                        </p>
                    ) : null}
                    {displayAddress ? (
                        <p>
                            📍 {displayAddress}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Human Biomedical LLP. All Rights Reserved.
            </div>
        </footer>
    );
}