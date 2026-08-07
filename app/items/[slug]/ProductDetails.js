"use client";

import "./productSlug.css";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDocs, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";

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

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const staticRoutes = [
        "about",
        "items",
        "services",
        "contact"
    ];

    const clientDistrict =
        pathParts.length > 0 &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const clientCity = clientDistrict
        ? clientDistrict
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "India";

    const district = propDistrict !== undefined ? propDistrict : clientDistrict;
    const city = propCity !== undefined ? propCity : clientCity;

    useEffect(() => {
        if (initialProduct) {
            setProduct(initialProduct);
            setSelectedImage(initialProduct.images?.[0] || initialProduct.image || "");
            setSelectedMedia("image");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "humanbiomedicalsin",
                        "pages",
                        "products"
                    )
                );

                if (snap.exists()) {
                    const products = snap.data().products || [];
                    let found = products.find((item) => {
                        const itemSlug =
                            item.slug ||
                            item.title
                                ?.toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9\s-]/g, "")
                                .replace(/\s+/g, "-");

                        return itemSlug === slug;
                    });

                    let productData = found;

                    if (!productData) {
                        const categorySnap = await getDocs(
                            collection(
                                db,
                                "websites",
                                "humanbiomedicalsin",
                                "pages",
                                "categoryproducts",
                                "categories"
                            )
                        );

                        categorySnap.forEach((categoryDoc) => {
                            const categoryProducts =
                                categoryDoc.data()?.products || [];

                            const match = categoryProducts.find((item) => {
                                const itemSlug =
                                    item.slug ||
                                    item.title
                                        ?.toLowerCase()
                                        .trim()
                                        .replace(/[^a-z0-9\s-]/g, "")
                                        .replace(/\s+/g, "-");

                                return itemSlug === slug;
                            });

                            if (match) {
                                productData = match;
                            }
                        });
                    }

                    setProduct(productData);

                    if (productData) {
                        setSelectedImage(
                            productData.images?.[0] || productData.image || ""
                        );
                        setSelectedMedia("image");
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
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
            newErrors.email = "Enter valid email";
        }

        if (message.trim().length < 10) {
            newErrors.message = "Minimum 10 characters required";
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
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalsin",
                    "productQueries"
                ),
                {
                    productName: product.title,
                    productSlug: product.slug || slug,
                    productImage: product.image || "",
                    brand: product.brand || "",
                    model: product.model || "",
                    name,
                    phone,
                    email,
                    message,
                    createdAt: new Date()
                }
            );

            toast.success("Enquiry Submitted Successfully");

            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
            setErrors({});
        } catch (err) {
            toast.error("Submission Failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: product.desc,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(
                    window.location.href
                );
                toast.success("Link Copied");
            }
        } catch (err) {
            console.log(err);
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
            <h2
                style={{
                    textAlign: "center",
                    marginTop: "150px"
                }}
            >
                Product Not Found
            </h2>
        );
    }

    return (
        <div className="product-details-page">
            <div className="product-details-container">
                <div className="product-image-box">
                    {selectedMedia === "video" && product.video ? (
                        <div className="product-detail-image-wrap">
                            <video
                                controls
                                className="product-detail-image"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            >
                                <source
                                    src={product.video}
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                    ) : (
                        <div className="product-detail-image-wrap">
                            <Image
                                src={
                                    selectedImage ||
                                    product.image ||
                                    "https://via.placeholder.com/700x500"
                                }
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 700px"
                                style={{ objectFit: "contain", borderRadius: "16px" }}
                                priority
                            />
                        </div>
                    )}

                    <div className="thumbnail-gallery">
                        {(product.images?.length
                            ? product.images
                            : [product.image]
                        ).map((img, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedImage(img);
                                    setSelectedMedia("image");
                                }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    position: "relative",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    border:
                                        selectedImage === img
                                            ? "2px solid #2563eb"
                                            : "1px solid #ddd"
                                }}
                            >
                                <Image
                                    src={img || "https://via.placeholder.com/80x80"}
                                    alt={`${product.title} thumbnail ${index}`}
                                    fill
                                    sizes="80px"
                                    style={{ objectFit: "contain" }}
                                    loading="lazy"
                                />
                            </div>
                        ))}

                        {product.video && (
                            <div
                                onClick={() => setSelectedMedia("video")}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    position: "relative",
                                    flexShrink: 0
                                }}
                            >
                                <video
                                    src={product.video}
                                    muted
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        pointerEvents: "none"
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(0,0,0,.35)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#fff",
                                        fontSize: 24
                                    }}
                                >
                                    <FaPlay />
                                </div>
                            </div>
                        )}

                        {product.pdf && (
                            <a
                                href={product.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: 80,
                                    height: 80,
                                    background: "#8B1E1E",
                                    color: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    flexShrink: 0
                                }}
                            >
                                PDF
                            </a>
                        )}
                    </div>
                </div>

                <div className="product-info">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20
                        }}
                    >
                        <h1>{product.title}</h1>
                        <button
                            className="submit-btn"
                            style={{
                                width: 52,
                                height: 52,
                                padding: 0,
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onClick={handleShare}
                            aria-label="Share product"
                        >
                            <span style={{ fontSize: "20px" }}>🔗</span>
                        </button>
                    </div>

                    <p className="product-description">
                        {product.desc}
                    </p>

                    <div className="product-meta">
                        <div className="meta-card">
                            <strong>Brand</strong>
                            <span>{product.brand || "N/A"}</span>
                        </div>
                        <div className="meta-card">
                            <strong>Model</strong>
                            <span>{product.model || "N/A"}</span>
                        </div>
                        <div className="meta-card">
                            <strong>Availability</strong>
                            <span>{product.availability || "Available"}</span>
                        </div>
                        <div className="meta-card">
                            <strong>Automation</strong>
                            <span>{product.automation || "N/A"}</span>
                        </div>
                        <div className="meta-card">
                            <strong>Usage</strong>
                            <span>{product.usage || "N/A"}</span>
                        </div>
                        <div className="meta-card">
                            <strong>Product</strong>
                            <span>{product.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="enquiry-section">
                <div className="enquiry-card">
                    <h2>Product Enquiry Form</h2>
                    <form
                        onSubmit={submitEnquiry}
                        className="enquiry-form"
                    >
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitting}
                        />
                        {errors.name && (
                            <span className="error-text">
                                {errors.name}
                            </span>
                        )}

                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={phone}
                            maxLength={10}
                            disabled={submitting}
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

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                        />
                        {errors.email && (
                            <span className="error-text">
                                {errors.email}
                            </span>
                        )}

                        <textarea
                            rows="6"
                            placeholder="Write your enquiry..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={submitting}
                        />
                        {errors.message && (
                            <span className="error-text">
                                {errors.message}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? "Sending..." : "Send Enquiry"}
                        </button>
                    </form>
                </div>

                <div className="seo-content">
                    <h2>
                        {product.title} Supplier in {city}
                    </h2>
                    <p>
                        Human Biomedical is a trusted supplier of
                        {` ${product.title} `}in {city}.
                        We provide high-quality biomedical and laboratory
                        equipment for hospitals, pathology labs,
                        diagnostic centres and healthcare institutions.
                    </p>

                    <h2>
                        {product.title} Manufacturer in {city}
                    </h2>
                    <p>
                        Looking for a reliable {product.title} manufacturer
                        in {city}? We offer advanced technology,
                        accurate performance and complete after-sales support
                        for laboratories and hospitals.
                    </p>

                    <h2>
                        Why Choose Our {product.title} in {city}
                    </h2>
                    <p>
                        Our {product.title} is widely used in hospitals,
                        clinics, pathology laboratories and research centres
                        across {city}. It delivers dependable results,
                        user-friendly operation and long-term performance.
                    </p>

                    <h2>
                        Buy {product.title} in {city}
                    </h2>
                    <p>
                        Contact Human Biomedical to get the latest price,
                        specifications and installation support for
                        {` ${product.title} `}in {city}.
                    </p>
                </div>
            </div>
        </div>
    );
}
