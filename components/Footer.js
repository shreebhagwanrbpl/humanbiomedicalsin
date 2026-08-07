"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { db, getCachedDoc } from "../lib/firebase";
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

                const contactSnap = await getCachedDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "contact"
                    )
                );

                if (contactSnap.exists()) {
                    setContactInfo(
                        contactSnap.data().contactInfo || []
                    );
                }

                if (
                    district &&
                    district.toLowerCase() !== "jaipur"
                ) {

                    const districtSnap = await getCachedDoc(
                        doc(
                            db,
                            "websites",
                            "humanbiomedicalsin",
                            "districts",
                            district
                        )
                    );

                    if (districtSnap.exists()) {
                        setDistrictData(
                            districtSnap.data()
                        );
                    }
                }

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [district]);

    const phonePrimary = "+91 9251598228";
    const phoneSecondary = "+91 8112279728";

    const email =
        contactInfo.find(
            item =>
                item.label.toLowerCase() === "email"
        )?.value || "humanbiomedicalsin@gmail.com";

    const address =
        contactInfo.find(
            item =>
                item.label.toLowerCase() === "address"
        )?.value || "Jaipur, Rajasthan, India";

    const displayAddress =
        !district ||
            district.toLowerCase() === "jaipur"
            ? address
            : `${districtData?.district || city}, ${districtData?.state || ""}, India`;

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
                    <h2>Human Biomedical LLP</h2>
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
                    <p>
                        📞 <a href="tel:+919251598228" style={{ color: "inherit", textDecoration: "none" }}>+91 9251598228</a>
                    </p>
                    <p>
                        📞 <a href="tel:+918112279728" style={{ color: "inherit", textDecoration: "none" }}>+91 8112279728</a>
                    </p>
                    <p>
                        📧 <a href={`mailto:${email}`} style={{ color: "inherit", textDecoration: "none" }}>{email}</a>
                    </p>
                    <p>
                        📍 {displayAddress}
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Human Biomedical LLP. All Rights Reserved.
            </div>
        </footer>
    );
}