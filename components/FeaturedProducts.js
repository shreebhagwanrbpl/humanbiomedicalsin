"use client";

import { usePathname } from "next/navigation";
import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedProducts({ products: initialProducts, district: propDistrict }) {
    const [products, setProducts] = useState(initialProducts || []);
    const [loading, setLoading] = useState(!initialProducts);

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

    const clientDistrict =
        pathParts[0] &&
            !staticRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "";

    const district = propDistrict !== undefined ? propDistrict : clientDistrict;

    useEffect(() => {
        if (initialProducts) return;

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
    }, [initialProducts]);

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
                        <div className="product-image" style={{ position: "relative", width: "100%", height: "240px" }}>
                            <Image
                                src={
                                    product.image ||
                                    "/placeholder-product.jpg"
                                }
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                style={{ objectFit: "contain" }}
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