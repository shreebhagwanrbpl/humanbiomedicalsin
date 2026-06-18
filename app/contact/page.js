"use client";
import "./Contact.css";
import { usePathname } from "next/navigation";
import "./Contact.css";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [districtData, setDistrictData] = useState(null);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
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

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "";
    const validateForm = () => {
        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name = "Minimum 3 characters required";
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter valid 10 digit mobile number";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter valid email";
        }

        if (message.trim().length < 10) {
            newErrors.message = "Minimum 10 characters required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const submitContact = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all fields correctly");
            return;
        }

        try {
            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalsin",
                    "contactQueries"
                ),
                {
                    name,
                    email,
                    phone,
                    message,
                    district: district || "jaipur",
                    createdAt: Timestamp.now()
                }
            );

            toast.success("Message sent successfully");

            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setErrors({});

        } catch (err) {
            console.error(err);
            toast.error("Submission failed");
        }
    };
    useEffect(() => {

        const fetchContact = async () => {

            try {

                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "contact"
                    )
                );

                if (snap.exists()) {
                    setContactInfo(
                        snap.data().contactInfo || []
                    );
                }

                // District fetch
                if (
                    district &&
                    district.toLowerCase() !== "jaipur"
                ) {

                    const districtSnap = await getDoc(
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

        fetchContact();

    }, [district]);

    const contactPhone =
        contactInfo.find(
            item =>
                item.label.toLowerCase() === "phone"
        )?.value || "";

    const contactEmail =
        contactInfo.find(
            item =>
                item.label.toLowerCase() === "email"
        )?.value || "";

    const address =
        contactInfo.find(
            item =>
                item.label.toLowerCase() === "address"
        )?.value || "";

    const displayAddress =
        !district ||
            district === "jaipur"
            ? address
            : `${districtData?.district || city}, ${districtData?.state || ""}, India`;
    if (loading) {
        return (
            <main className="contact-page">

                <section className="contact-hero">

                    <div className="skeleton badge-loader"></div>

                    <div className="skeleton hero-title-loader"></div>

                    <div className="skeleton hero-text-loader"></div>
                    <div className="skeleton hero-text-loader short"></div>

                </section>

                <section className="contact-section">

                    <div className="contact-container">

                        {/* Left Side */}

                        <div className="contact-info">

                            <div className="skeleton section-title-loader"></div>

                            {[1, 2, 3].map((item) => (
                                <div
                                    className="info-card"
                                    key={item}
                                >
                                    <div className="skeleton card-title-loader"></div>

                                    <div className="skeleton card-text-loader"></div>
                                </div>
                            ))}

                        </div>

                        {/* Right Side */}

                        <div className="contact-form-card">

                            <div className="skeleton form-title-loader"></div>

                            <div className="skeleton input-loader"></div>
                            <div className="skeleton input-loader"></div>
                            <div className="skeleton input-loader"></div>

                            <div className="skeleton textarea-loader"></div>

                            <div className="skeleton button-loader"></div>

                        </div>

                    </div>

                </section>

            </main>
        );
    }
    return (<main className="contact-page" > {
        /* Hero */
    }

        <section className="contact-hero" >
            <span className="contact-badge" > Contact Human Biomedical </span>
            <h1>
                Let's Discuss Your Biomedical Requirements

                {city && (
                    <>
                        <br />
                        In {city}
                    </>
                )}
            </h1>
            <p>
                Get in touch with our team for product inquiries,
                installation support, AMC services and technical assistance

                {city && ` in ${city}`}.
            </p>
        </section> {
            /* Contact Section */
        }

        <section className="contact-section" > <div className="contact-container" > {
            /* Left Side */
        }

            <div className="contact-info" >
                <h2>Get In Touch</h2>
                <p>
                    Our experts are ready to assist you with biomedical
                    equipment solutions and support

                    {city && ` in ${city}`}.
                </p>
                <div className="info-card" >
                    <h3>📞 Phone</h3>
                    <p>{contactPhone}</p>
                </div>
                <div className="info-card" >
                    <h3>📧 Email</h3>
                    <p>{contactEmail}</p>
                </div>
                <div className="info-card" >
                    <h3>📍 Address</h3>
                    <p>{displayAddress}</p>
                </div>
            </div> {
                /* Right Side */
            }

            <div className="contact-form-card">

                <h2>Send Message</h2>

                <form
                    className="contact-form"
                    onSubmit={submitContact}
                >

                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {errors.name && (
                        <span className="error-text">
                            {errors.name}
                        </span>
                    )}

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {errors.email && (
                        <span className="error-text">
                            {errors.email}
                        </span>
                    )}

                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={phone}
                        maxLength={10}
                        inputMode="numeric"
                        onChange={(e) =>
                            setPhone(
                                e.target.value.replace(/[^0-9]/g, "")
                            )
                        }
                    />

                    {errors.phone && (
                        <span className="error-text">
                            {errors.phone}
                        </span>
                    )}

                    <textarea
                        rows="6"
                        placeholder="Write your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {errors.message && (
                        <span className="error-text">
                            {errors.message}
                        </span>
                    )}

                    <button type="submit">
                        Send Inquiry
                    </button>

                </form>

            </div> </div> </section> </main>);
}