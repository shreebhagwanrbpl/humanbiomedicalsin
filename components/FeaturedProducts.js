"use client";

import { usePathname } from "next/navigation";
import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturedProducts({ initialProducts = [], products: propProducts = [] }) {
    const initialList = propProducts.length > 0 ? propProducts : initialProducts;
    const [products, setProducts] = useState(initialList.slice(0, 4));
    const [loading, setLoading] = useState(initialList.length === 0);

    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];
    const district = pathParts[0] && !staticRoutes.includes(pathParts[0]) ? pathParts[0] : "";

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
                    console.error("Error loading featured products:", err);
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
        <section className="featured-products">
            <div className="section-header">
                <span className="sub-tag">QUALITY MEDICAL TECHNOLOGY</span>
                <h2>Featured Biomedical Products</h2>
                <p>Explore our top-performing laboratory analyzers, diagnostic systems and medical consumables.</p>
            </div>

            <div className="products-grid">
                {products.map((product, index) => {
                    const imgUrl = product.images?.[0] || product.image || "/placeholder-product.jpg";
                    return (
                        <div
                            className="product-card"
                            key={(product.slug || product.id || "product") + "-" + index}
                        >
                            <div className="product-image">
                                <img
                                    src={imgUrl}
                                    alt={product.title}
                                    loading="lazy"
                                />
                            </div>

                            <div className="product-content">
                                <h3>{product.title}</h3>

                                <div className="product-meta">
                                    <p>
                                        <strong>Brand:</strong> {product.brand || "Human Biomedicals"}
                                    </p>
                                    <p>
                                        <strong>Model:</strong> {product.model || "Standard"}
                                    </p>
                                    {product.price && (
                                        <p className="product-price">
                                            <strong>Price:</strong> ₹{product.price}
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={district ? "/" + district + "/items/" + product.slug : "/items/" + product.slug}
                                    className="product-btn"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="view-all-btn-wrap">
                <Link
                    href={district ? "/" + district + "/items" : "/items"}
                    className="view-all-btn"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
