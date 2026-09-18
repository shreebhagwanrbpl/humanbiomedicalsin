"use client";

import { usePathname } from "next/navigation";
import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturedProducts({ initialProducts = [] }) {
    const [products, setProducts] = useState(initialProducts.slice(0, 4));
    const [loading, setLoading] = useState(initialProducts.length === 0);

    const pathname = usePathname();

    const pathParts = pathname.split("/").filter(Boolean);
    const staticRoutes = ["about", "items", "services", "contact"];

    const district =
        pathParts[0] && !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    useEffect(() => {
        let isMounted = true;

        const loadFeatured = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
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

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading && products.length === 0) {
        return (
            <section className="featured-products" key={pathname}>
                <h2>Featured Biomedical Products</h2>
                <div className="products-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div className="product-card" key={item}>
                            <div className="skeleton featured-image-loader"></div>
                            <div className="product-content">
                                <div className="skeleton featured-title-loader"></div>
                                <div className="skeleton featured-text-loader"></div>
                                <div className="skeleton featured-text-loader short"></div>
                                <div className="skeleton featured-btn-loader"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="featured-products" key={pathname}>
            <h2>Featured Biomedical Products</h2>

            <div className="products-grid">
                {products.map((product, index) => {
                    const imgUrl = product.images?.[0] || product.image || "/placeholder-product.jpg";
                    return (
                        <div
                            className="product-card"
                            key={`${product.slug || product.id || "product"}-${index}`}
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
                                        <p style={{ color: "#059669", fontWeight: "700" }}>
                                            <strong>Price:</strong> ₹{product.price}
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={
                                        district
                                            ? `/${district}/items/${product.slug}`
                                            : `/items/${product.slug}`
                                    }
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
                    href={district ? `/${district}/items` : "/items"}
                    className="view-all-btn"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
