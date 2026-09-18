"use client";

import "./productSlug.css";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { FaPlay, FaPhoneAlt, FaWhatsapp, FaDownload, FaFilePdf } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import BrochureGenerator from "../../../components/BrochureGenerator";

export default function ProductDetails({ initialProduct, district: propDistrict, city: propCity }) {
    const { slug } = useParams();

    const [product, setProduct] = useState(initialProduct || null);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(!initialProduct);
    const [selectedImage, setSelectedImage] = useState(initialProduct?.images?.[0] || initialProduct?.image || "");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [submitting, setSubmitting] = useState(false);
    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];

    const clientDistrict =
        pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const clientCity = clientDistrict
        ? clientDistrict.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "India";

    const district = propDistrict !== undefined ? propDistrict : clientDistrict;
    const city = propCity !== undefined && propCity !== "" ? propCity : clientCity;

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            setSelectedImage(initialProduct.images?.[0] || initialProduct.image || "");
            setSelectedMedia("image");
            setLoading(false);
            return;
        }

        const fetchProductFromApi = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    const found = (data.products || []).find((p) => p.slug === slug || p.id === slug);
                    if (found) {
                        setProduct(found);
                        setSelectedImage(found.images?.[0] || found.image || "");
                        setSelectedMedia("image");
                    }
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductFromApi();
    }, [slug, initialProduct]);

    const validateForm = () => {
        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name = "Minimum 3 characters required";
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter valid 10 digit mobile number";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter valid email address";
        }

        if (message.trim().length < 5) {
            newErrors.message = "Minimum 5 characters required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitEnquiry = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all fields correctly");
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(
                collection(db, "websitesQueries", "humanbiomedicalsin", "productQueries"),
                {
                    productName: product?.title || "Biomedical Product",
                    productSlug: product?.slug || slug,
                    productImage: selectedImage || product?.image || "",
                    brand: product?.brand || "",
                    model: product?.model || "",
                    category: product?.category || "",
                    subCategory: product?.subCategory || "",
                    price: product?.price || "",
                    district: district || "Direct",
                    city: city || "India",
                    name,
                    phone,
                    email,
                    message,
                    createdAt: new Date(),
                }
            );

            toast.success("Enquiry Submitted Successfully! Our team will contact you soon.");

            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
            setErrors({});
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Submission failed. Please call us directly.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product?.title || "Human Biomedicals",
                    text: product?.desc || "Check out this biomedical equipment from Human Biomedicals",
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied to clipboard!");
            }
        } catch (err) {
            // Share cancelled
        }
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <div className="product-details-container">
                    <div className="skeleton image-loader"></div>
                    <div>
                        <div className="skeleton title-loader"></div>
                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader"></div>
                        <div className="skeleton text-loader short"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-page" style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2>Product Not Found</h2>
                <p style={{ color: "#64748b", margin: "14px 0 24px" }}>The requested biomedical equipment could not be found or has been updated.</p>
                <Link
                    href={district ? `/${district}/items` : "/items"}
                    style={{
                        padding: "10px 24px",
                        background: "#0f4c81",
                        color: "#fff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                    }}
                >
                    View All Products
                </Link>
            </div>
        );
    }

    const allImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : ["/placeholder-product.jpg"];

    return (
        <div className="product-details-page">
            {/* Breadcrumb Navigation */}
            <nav style={{ maxWidth: "1200px", margin: "0 auto 16px", padding: "0 16px", fontSize: "13px", color: "#64748b" }}>
                <Link href="/" style={{ color: "#0f4c81", textDecoration: "none" }}>Home</Link>
                <span> &gt; </span>
                <Link href={district ? `/${district}/items` : "/items"} style={{ color: "#0f4c81", textDecoration: "none" }}>
                    Catalog
                </Link>
                {product.category && (
                    <>
                        <span> &gt; </span>
                        <span>{product.category}</span>
                    </>
                )}
                <span> &gt; </span>
                <strong style={{ color: "#1e293b" }}>{product.title}</strong>
            </nav>

            <div className="product-details-container">
                {/* Left Column: Media Gallery */}
                <div className="product-image-box">
                    {selectedMedia === "video" && product.video ? (
                        <div className="product-detail-image-wrap">
                            <video
                                controls
                                autoPlay
                                className="product-detail-image"
                                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "16px" }}
                            >
                                <source src={product.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div className="product-detail-image-wrap" style={{ position: "relative", minHeight: "360px" }}>
                            <img
                                src={selectedImage || allImages[0]}
                                alt={product.title}
                                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "16px" }}
                            />
                        </div>
                    )}

                    {/* Thumbnails */}
                    <div className="thumbnail-gallery" style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                        {allImages.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedImage(img);
                                    setSelectedMedia("image");
                                }}
                                style={{
                                    width: 75,
                                    height: 75,
                                    position: "relative",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    background: "#f8fafc",
                                    border: selectedImage === img && selectedMedia === "image" ? "2px solid #0f4c81" : "1px solid #e2e8f0",
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`${product.title} thumbnail ${index + 1}`}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    loading="lazy"
                                />
                            </div>
                        ))}

                        {product.video && (
                            <div
                                onClick={() => setSelectedMedia("video")}
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    position: "relative",
                                    flexShrink: 0,
                                    background: "#0f172a",
                                    border: selectedMedia === "video" ? "2px solid #0f4c81" : "1px solid #e2e8f0",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#fff",
                                        fontSize: 20,
                                        gap: 2,
                                    }}
                                >
                                    <FaPlay />
                                    <span style={{ fontSize: "9px", fontWeight: "700" }}>VIDEO</span>
                                </div>
                            </div>
                        )}

                        {product.pdf && (
                            <a
                                href={product.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: 75,
                                    height: 75,
                                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                    color: "#fff",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    flexShrink: 0,
                                    gap: 3,
                                }}
                            >
                                <FaFilePdf size={20} />
                                <span style={{ fontSize: "9px" }}>PDF</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Column: Title, Specifications & CTAs */}
                <div className="product-info">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: "10px" }}>
                        <div>
                            {product.category && (
                                <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f4c81", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    {product.category} {product.subCategory && product.subCategory !== product.category ? `• ${product.subCategory}` : ""}
                                </span>
                            )}
                            <h1 style={{ margin: "4px 0 6px 0", fontSize: "24px", color: "#0f172a", lineHeight: "1.3" }}>
                                {product.title}
                            </h1>
                            {product.price && (
                                <div style={{ fontSize: "20px", fontWeight: "800", color: "#059669", margin: "6px 0" }}>
                                    ₹{product.price}
                                </div>
                            )}
                        </div>

                        <button
                            className="submit-btn"
                            style={{
                                width: 44,
                                height: 44,
                                padding: 0,
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "#f1f5f9",
                                color: "#334155",
                                border: "1px solid #cbd5e1",
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                            onClick={handleShare}
                            title="Share product"
                            aria-label="Share product"
                        >
                            <span style={{ fontSize: "18px" }}>🔗</span>
                        </button>
                    </div>

                    {product.desc && (
                        <p className="product-description" style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", marginBottom: "16px" }}>
                            {product.desc}
                        </p>
                    )}

                    {/* Single Unified Specifications Grid */}
                    <div className="product-meta">
                        {product.brand && (
                            <div className="meta-card">
                                <strong>Brand</strong>
                                <span>{product.brand}</span>
                            </div>
                        )}
                        {product.model && (
                            <div className="meta-card">
                                <strong>Model</strong>
                                <span>{product.model}</span>
                            </div>
                        )}
                        {product.instrument && (
                            <div className="meta-card">
                                <strong>Instrument</strong>
                                <span>{product.instrument}</span>
                            </div>
                        )}
                        {product.capacity && (
                            <div className="meta-card">
                                <strong>Capacity</strong>
                                <span>{product.capacity}</span>
                            </div>
                        )}
                        {product.throughput && (
                            <div className="meta-card">
                                <strong>Throughput</strong>
                                <span>{product.throughput}</span>
                            </div>
                        )}
                        {product.automation && (
                            <div className="meta-card">
                                <strong>Automation</strong>
                                <span>{product.automation}</span>
                            </div>
                        )}
                        {product.usage && (
                            <div className="meta-card">
                                <strong>Usage</strong>
                                <span>{product.usage}</span>
                            </div>
                        )}
                        {product.parameters && (
                            <div className="meta-card">
                                <strong>Parameters</strong>
                                <span>{product.parameters}</span>
                            </div>
                        )}
                        {product.size && (
                            <div className="meta-card">
                                <strong>Size</strong>
                                <span>{product.size}</span>
                            </div>
                        )}
                        <div className="meta-card">
                            <strong>Availability</strong>
                            <span>{product.availability || "In Stock / Direct Supply"}</span>
                        </div>
                    </div>

                    {/* BROCHURE PDF GENERATOR */}
                    <BrochureGenerator product={product} selectedImage={selectedImage || allImages[0]} />

                    {/* QUICK CONTACT ACTION BUTTONS */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                        <a
                            href="tel:+919251598228"
                            style={{
                                flex: 1,
                                minWidth: "160px",
                                background: "#0f4c81",
                                color: "#ffffff",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: "0 2px 4px rgba(15, 76, 129, 0.2)",
                            }}
                        >
                            <FaPhoneAlt /> Call +91 9251598228
                        </a>
                        <a
                            href={`https://wa.me/919251598228?text=Hello%20Human%20Biomedicals,%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                flex: 1,
                                minWidth: "160px",
                                background: "#25d366",
                                color: "#ffffff",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: "0 2px 4px rgba(37, 211, 102, 0.2)",
                            }}
                        >
                            <FaWhatsapp /> WhatsApp Inquiry
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Request Quote Form + District SEO content */}
            <div className="enquiry-section">
                <div className="enquiry-card">
                    <h2>Request a Quote &bull; Instant Callback</h2>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
                        Fill out the form below to receive best pricing and technical brochure for <strong>{product.title}</strong>.
                    </p>
                    <form onSubmit={submitEnquiry} className="enquiry-form">
                        <input
                            type="text"
                            placeholder="Your Full Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                            suppressHydrationWarning
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}

                        <input
                            type="tel"
                            placeholder="Mobile Number (10 digits) *"
                            value={phone}
                            maxLength={10}
                            disabled={submitting}
                            suppressHydrationWarning
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}

                        <input
                            type="email"
                            placeholder="Email Address *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                            suppressHydrationWarning
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}

                        <textarea
                            rows="4"
                            placeholder={`I would like to inquire about pricing, delivery timeline, and warranty for ${product.title}...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={submitting}
                            suppressHydrationWarning
                        />
                        {errors.message && <span className="error-text">{errors.message}</span>}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                            suppressHydrationWarning
                            style={{
                                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #0f4c81, #1e3a8a)",
                                color: "#ffffff",
                                fontWeight: "700",
                                padding: "14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: submitting ? "not-allowed" : "pointer",
                                fontSize: "15px",
                            }}
                        >
                            {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                        </button>
                    </form>
                </div>

                <div className="seo-content">
                    <h2>
                        {product.title} Supplier in {city}
                    </h2>
                    <p>
                        Human Biomedicals is a premier supplier of
                        {` ${product.title} `}in {city}.
                        We provide high-quality biomedical, diagnostic and laboratory
                        equipment for hospitals, pathology labs,
                        diagnostic centres and healthcare institutions across India.
                    </p>

                    <h2>
                        Technical Support &amp; Installation in {city}
                    </h2>
                    <p>
                        Looking for reliable biomedical equipment solutions in {city}?
                        We offer cutting-edge diagnostic technology, calibrated performance,
                        on-site installation, staff training, and dependable after-sales AMC support.
                    </p>

                    <h2>
                        Why Choose Human Biomedicals?
                    </h2>
                    <p>
                        Our {product.title} is widely deployed in clinical laboratories, hospitals,
                        pathology centres, and medical research facilities in {city} and nationwide.
                        Engineered for dependable results, robust throughput, and low maintenance.
                    </p>

                    <h2>
                        Get Best Price Quote in {city}
                    </h2>
                    <p>
                        Contact Human Biomedicals today to get competitive pricing, complete product catalogs,
                        and direct distributor support for {` ${product.title} `}in {city}.
                    </p>
                </div>
            </div>
        </div>
    );
}
