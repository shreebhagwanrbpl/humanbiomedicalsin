"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactClient({ contactInfo = [], districtData = null, city = "", district = "" }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

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

        setSubmitting(true);
        try {
            const res = await fetch("/api/contact-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: String(phone).trim(),
                    message: message.trim(),
                    district: district || "jaipur",
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(data.message || "Message sent successfully");
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
                setErrors({});
            } else {
                toast.error(data.error || "Submission failed");
            }
        } catch (err) {
            console.error("Contact submission error:", err);
            toast.error("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const contactEmail =
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

    return (
        <main className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <span className="contact-badge"> Contact Human Biomedical LLP </span>
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
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-container">
                    {/* Left Side */}
                    <div className="contact-info">
                        <h2>Get In Touch</h2>
                        <p>
                            Our experts are ready to assist you with biomedical
                            equipment solutions and support
                            {city && ` in ${city}`}.
                        </p>

                        {phoneList.length > 0 && (
                            <div className="info-card">
                                <h3>📞 Phone Numbers</h3>
                                <p style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {phoneList.map((p, idx) => (
                                        <a
                                            key={idx}
                                            href={`tel:${Array.isArray(p.value) ? p.value[0] : p.value}`}
                                            style={{ color: "#0f4c81", fontWeight: "600", textDecoration: "none" }}
                                        >
                                            {p.value}
                                        </a>
                                    ))}
                                </p>
                            </div>
                        )}

                        {contactEmail && (
                            <div className="info-card">
                                <h3>📧 Email Address</h3>
                                <p>
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        style={{ color: "inherit", textDecoration: "none" }}
                                    >
                                        {contactEmail}
                                    </a>
                                </p>
                            </div>
                        )}

                        {displayAddress && (
                            <div className="info-card">
                                <h3>📍 Address</h3>
                                <p>{displayAddress}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
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
                                disabled={submitting}
                                suppressHydrationWarning
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
                                disabled={submitting}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value.replace(/[^0-9]/g, "")
                                    )
                                }
                                disabled={submitting}
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
                                disabled={submitting}
                                suppressHydrationWarning
                            />
                            {errors.message && (
                                <span className="error-text">
                                    {errors.message}
                                </span>
                            )}

                            <button type="submit" disabled={submitting} suppressHydrationWarning>
                                {submitting ? "Sending..." : "Send Enquiry"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
