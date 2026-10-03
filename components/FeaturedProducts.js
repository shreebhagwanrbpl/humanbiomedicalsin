"use client";

import { usePathname } from "next/navigation";
import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaTag, FaCheckCircle } from "react-icons/fa";

export default function FeaturedProducts({ initialProducts = [], products: propProducts = [] }) {
    const initialList = propProducts.length > 0 ? propProducts : initialProducts;
    const [products, setProducts] = useState(initialList.slice(0, 4));
    const [loading, setLoading] = useState(initialList.length === 0);

    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "";
    const prefix = district ? `/${district}` : "";

    useEffect(() => {
        let isMounted = true;
        if (initialList.length === 0) {
            const loadFeatured = async () => {
                try {
                    const res = await fetch("/api/products");
                    if (res.ok) {
                        const data = await res.json();
                        if (isMounted && data.products && data.products.length > 0) {
                            setProducts(data.products.slice(0, 4));
                        }
                    }
                } catch (err) {
                    // Silently ignore
                } finally {
                    if (isMounted) setLoading(false);
                }
            };
            loadFeatured();
        } else {
            setLoading(false);
        }
        return () => { isMounted = false; };
    }, [initialList]);

    return (
        <section className="featured-section">
            <div className="section-header">
                <span className="section-sub-badge">PREMIUM DIAGNOSTIC SYSTEMS</span>
                <h2 className="section-main-title">Featured Biomedical Products</h2>
                <p className="section-subtitle">
                    Explore top-tier laboratory analyzers, hematology counters, and diagnostic instruments supplied across India.
                </p>
            </div>

            <div className="products-grid-container">
                {products.map((product, index) => {
                    const imgUrl = product.images?.[0] || product.image || "/biomedical-hero.jpg";
                    return (
                        <div
                            className="modern-product-card"
                            key={(product.slug || product.id || "prod") + "-" + index}
                        >
                            <div className="product-card-top">
                                <span className="category-pill">{product.category || "Biomedical"}</span>
                                <span className="stock-pill"><FaCheckCircle /> Certified</span>
                            </div>

                            <div className="product-image-box">
                                <img
                                    src={imgUrl}
                                    alt={product.title}
                                    loading="lazy"
                                />
                            </div>

                            <div className="product-card-body">
                                <h3 className="product-title">{product.title}</h3>

                                <div className="product-specs">
                                    <div className="spec-row">
                                        <span className="spec-lbl">Brand:</span>
                                        <span className="spec-val">{product.brand || "Human Biomedical"}</span>
                                    </div>
                                    <div className="spec-row">
                                        <span className="spec-lbl">Model:</span>
                                        <span className="spec-val">{product.model || "Standard"}</span>
                                    </div>
                                </div>

                                {product.price && (
                                    <div className="product-price-tag">
                                        <FaTag /> ₹{product.price}
                                    </div>
                                )}

                                <Link
                                    href={`${prefix}/items/${product.slug}`}
                                    className="product-action-btn"
                                >
                                    View Details <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="catalog-btn-wrapper">
                <Link
                    href={`${prefix}/items`}
                    className="view-catalog-btn"
                >
                    Explore Complete Catalog ({products.length > 0 ? "104+ Products" : "All Products"}) <FaArrowRight />
                </Link>
            </div>
        </section>
    );
}
