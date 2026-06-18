"use client";

import { usePathname } from "next/navigation";
import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const staticRoutes = [
        "about",
        "items",
        "services",
        "contact",
    ];

    const district =
        pathParts[0] &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    useEffect(() => {
        const fetchProducts = async () => {
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
                    const allProducts =
                        snap.data().products || [];

                    setProducts(
                        allProducts.slice(0, 4)
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section
                className="featured-products"
                key={pathname}
            >
                <h2>Featured Products</h2>

                <div className="products-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="product-card"
                            key={item}
                        >
                            <div className="skeleton featured-image-loader"></div>

                            <div className="product-content">
                                <div className="skeleton featured-title-loader"></div>

                                <div className="skeleton featured-text-loader"></div>
                                <div className="skeleton featured-text-loader short"></div>

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

    return (
        <section
            className="featured-products"
            key={pathname}
        >
            <h2>Featured Products</h2>

            <div className="products-grid">
                {products.map((product, index) => (
                    <div
                        className="product-card"
                        key={`${product.slug || product.id || "product"}-${index}`}
                    >
                        <div className="product-image">
                            <img
                                src={
                                    product.image ||
                                    "/placeholder-product.jpg"
                                }
                                alt={product.title}
                                loading="lazy"
                            />
                        </div>

                        <div className="product-content">
                            <h3>
                                {product.title}
                            </h3>

                            <div className="product-meta">
                                <p>
                                    <strong>Brand:</strong>{" "}
                                    {product.brand ||
                                        "N/A"}
                                </p>

                                <p>
                                    <strong>Model:</strong>{" "}
                                    {product.model ||
                                        "N/A"}
                                </p>
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
                ))}
            </div>

            <div className="view-all-btn-wrap">
                <Link
                    href={
                        district
                            ? `/${district}/items`
                            : "/items"
                    }
                    className="view-all-btn"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}