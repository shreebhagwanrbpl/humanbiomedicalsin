"use client";

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { FaFilePdf, FaDownload, FaSpinner } from "react-icons/fa";
import "./BrochureGenerator.css";

const loadImageAsBase64 = async (url) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url;

    // Use local proxy API to completely bypass CORS for external URLs (Firebase, Unsplash, etc.)
    const proxiedUrl = url.startsWith("http")
        ? `/api/proxy-image?url=${encodeURIComponent(url)}`
        : url;

    try {
        const response = await fetch(proxiedUrl);
        if (!response.ok) return url;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(url);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Base64 image conversion error:", e);
        return url;
    }
};

export default function BrochureGenerator({ product, selectedImage, contactInfo = [] }) {
    const [downloading, setDownloading] = useState(false);
    const [base64Image, setBase64Image] = useState("");
    const brochureRef = useRef(null);

    const rawProductImage =
        selectedImage ||
        product?.images?.[0] ||
        product?.image ||
        "https://via.placeholder.com/400x300?text=Product+Image";

    useEffect(() => {
        if (rawProductImage) {
            loadImageAsBase64(rawProductImage).then((b64) => {
                if (b64) setBase64Image(b64);
            });
        }
    }, [rawProductImage]);

    const handleDownload = async () => {
        if (!product) return;
        setDownloading(true);
        const toastId = toast.loading("Processing High-Res PDF Brochure...");

        try {
            // Ensure image is converted to base64 before canvas capture
            let finalImageSrc = base64Image;
            if (!finalImageSrc || !finalImageSrc.startsWith("data:")) {
                finalImageSrc = await loadImageAsBase64(rawProductImage);
                if (finalImageSrc) setBase64Image(finalImageSrc);
            }

            // Brief delay to allow DOM re-render with base64 img
            await new Promise((r) => setTimeout(r, 200));

            const element = brochureRef.current;
            if (!element) {
                throw new Error("Brochure element not found");
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 800,
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

            const sanitizedTitle = (product.title || "Product")
                .replace(/[^a-zA-Z0-9]/g, "_")
                .toLowerCase();

            pdf.save(`${sanitizedTitle}_brochure.pdf`);
            toast.success("Brochure Downloaded Successfully!", { id: toastId });
        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const currentImgSrc = base64Image || rawProductImage;

    return (
        <>
            {/* DOWNLOAD BUTTON IN UI */}
            <button
                className="brochure-download-btn"
                onClick={handleDownload}
                disabled={downloading}
                title="Download PDF Specification Brochure"
                suppressHydrationWarning
            >
                {downloading ? (
                    <>
                        <FaSpinner className="spin-icon" /> Generating PDF...
                    </>
                ) : (
                    <>
                        <FaFilePdf className="pdf-icon" /> Download Brochure (PDF) <FaDownload className="dl-icon" />
                    </>
                )}
            </button>

            {/* HIDDEN BROCHURE TEMPLATE CONTAINER FOR CANVAS CAPTURE */}
            <div className="pdf-offscreen-container">
                <div className="brochure-pdf-page" ref={brochureRef}>
                    
                    {/* BACKGROUND WATERMARK */}
                    <div className="watermark-overlay">
                        {Array.from({ length: 24 }).map((_, idx) => (
                            <span key={idx} className="watermark-text">
                                HUMAN BIOMEDICAL LLP
                            </span>
                        ))}
                    </div>

                    {/* HEADER BANNER */}
                    <div className="brochure-header">
                        <div className="header-left">
                            <h1>Human Biomedical LLP</h1>
                        </div>
                        <div className="header-right">
                            {(() => {
                                const phoneList = contactInfo.filter(
                                    (item) =>
                                        item.label?.toLowerCase().includes("phone") ||
                                        item.label?.toLowerCase().includes("mobile") ||
                                        item.label?.toLowerCase().includes("call") ||
                                        item.label?.toLowerCase().includes("contact")
                                );
                                const phoneDisplay = phoneList.length > 0
                                    ? phoneList.map((p) => Array.isArray(p.value) ? p.value.join(", ") : p.value).join(", ")
                                    : "";

                                return phoneDisplay ? (
                                    <p><strong>Phone:</strong> {phoneDisplay}</p>
                                ) : null;
                            })()}
                            <p><strong>Web:</strong> www.humanbiomedicals.in</p>
                        </div>
                    </div>
                    <div className="header-gold-line"></div>

                    {/* MAIN CONTENT AREA */}
                    <div className="brochure-body">
                        
                        {/* PRODUCT TITLE */}
                        <h2 className="product-title">{product?.title || "Biomedical Equipment"}</h2>
                        
                        {/* SUBHEADER RIBBON */}
                        <div className="sub-ribbon">
                            OFFICIAL PRODUCT SPECIFICATION BROCHURE
                        </div>

                        {/* MIDDLE SPECIFICATION SECTION */}
                        <div className="middle-grid">
                            
                            {/* LEFT PRODUCT IMAGE BOX */}
                            <div className="product-image-card">
                                <div className="img-container">
                                    <img
                                        src={currentImgSrc}
                                        alt={product?.title || "Product"}
                                    />
                                </div>
                            </div>

                            {/* RIGHT KEY SPECIFICATIONS TABLE */}
                            <div className="specs-card">
                                <div className="specs-header">
                                    KEY SPECIFICATIONS
                                </div>
                                <div className="specs-table">
                                    <div className="spec-row alt">
                                        <span className="spec-label">Brand:</span>
                                        <span className="spec-value">{product?.brand || "Human Biomedical Partner"}</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Model:</span>
                                        <span className="spec-value">{product?.model || "N/A"}</span>
                                    </div>
                                    <div className="spec-row alt">
                                        <span className="spec-label">Instrument:</span>
                                        <span className="spec-value">{product?.instrument || "Diagnostic Equipment"}</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Usage:</span>
                                        <span className="spec-value">{product?.usage || "Clinical Laboratory"}</span>
                                    </div>
                                    <div className="spec-row alt">
                                        <span className="spec-label">Automation:</span>
                                        <span className="spec-value">{product?.automation || "Manual / Semi / Automated"}</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-label">Size / Capacity:</span>
                                        <span className="spec-value">{product?.capacity || "Standard"}</span>
                                    </div>
                                    <div className="spec-row alt">
                                        <span className="spec-label">Availability:</span>
                                        <span className="spec-value">{product?.availability || "In Stock"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCT OVERVIEW SECTION */}
                        <div className="overview-section">
                            <h3>PRODUCT OVERVIEW</h3>
                            <div className="overview-underline"></div>
                            <p>
                                {product?.desc ||
                                    `The ${product?.title || "Biomedical Equipment"} is an advanced diagnostic analyzer designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings across India.`}
                            </p>
                        </div>

                        {/* BOTTOM TWO CARDS */}
                        <div className="bottom-cards-grid">
                            
                            {/* KEY APPLICATIONS */}
                            <div className="info-box">
                                <div className="box-header">KEY APPLICATIONS</div>
                                <ul className="box-bullets gold-bullets">
                                    <li><span>🟡</span> Clinical Diagnostic Laboratories</li>
                                    <li><span>🟡</span> Hospitals & Healthcare Centres</li>
                                    <li><span>🟡</span> Pathology & Testing Labs</li>
                                    <li><span>🟡</span> Blood Banks & Research Units</li>
                                    <li><span>🟡</span> Medical Colleges & Institutions</li>
                                </ul>
                            </div>

                            {/* WHY CHOOSE HUMAN BIOMEDICAL LLP */}
                            <div className="info-box">
                                <div className="box-header">WHY CHOOSE HUMAN BIOMEDICAL LLP</div>
                                <ul className="box-bullets blue-bullets">
                                    <li><span>🔵</span> Trusted Biomedical Equipment Supplier</li>
                                    <li><span>🔵</span> 100% Genuine Leading Brand Products</li>
                                    <li><span>🔵</span> Competitive Pricing & Warranty Support</li>
                                    <li><span>🔵</span> Prompt Installation & Staff Training</li>
                                    <li><span>🔵</span> Fast Express Delivery Across India</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* FOOTER BANNER */}
                    <div className="footer-gold-line"></div>
                    <div className="brochure-footer">
                        <div className="footer-left">
                            <p className="company-name">HUMAN BIOMEDICAL LLP - Diagnostic Instruments & Healthcare Solutions</p>
                            <p className="company-tagline">Biomedical equipment sales, service, installation, AMC & calibration across India</p>
                        </div>
                        <div className="footer-right">
                            <p>Official Product Brochure | Confidential & Proprietary</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
