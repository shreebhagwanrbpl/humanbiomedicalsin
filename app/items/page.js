"use client";
import { usePathname } from "next/navigation";
import "./Products.css";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ItemPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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
    const productsPerPage = 12;
    const filteredProducts = products.filter((product) =>
        product.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );
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
                        allProducts.filter(
                            (item) => item.isPublished !== false
                        )
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const startIndex =
        (currentPage - 1) * productsPerPage;

    const currentProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );

    const getVisiblePages = () => {

        if (totalPages <= 3) {
            return Array.from(
                { length: totalPages },
                (_, i) => i + 1
            );
        }

        if (currentPage === 1) {
            return [1, 2, 3];
        }

        if (currentPage === totalPages) {
            return [
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        return [
            currentPage - 1,
            currentPage,
            currentPage + 1
        ];
    };
    if (loading) {
        return (
            <main className="products-page">

                <div className="products-hero">

                    <div className="products-hero-content">

                        <span className="products-badge">
                            Biomedical Equipment Catalog
                        </span>

                        <h1>
                            Advanced Laboratory &
                            Diagnostic Equipment

                            {city && (
                                <>
                                    <br />
                                    In {city}
                                </>
                            )}
                        </h1>

                    </div>

                </div>

                <div className="products-grid">

                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            className="product-card"
                            key={item}
                        >

                            <div className="skeleton product-image-loader"></div>

                            <div className="product-content">

                                <div className="skeleton title-loader"></div>

                                <div className="skeleton text-loader"></div>

                                <div className="skeleton text-loader short"></div>

                                <div className="skeleton btn-loader"></div>

                            </div>

                        </div>
                    ))}

                </div>

            </main>
        );
    }
    return (
        <main className="products-page">

            <div className="products-hero">

                <div className="products-hero-content">

                    <span className="products-badge">
                        Biomedical Equipment Catalog
                    </span>

                    <h1>
                        Advanced Laboratory &
                        Diagnostic Equipment
                    </h1>

                    <p>
                        Discover premium biomedical, laboratory and
                        hospital equipment designed for healthcare
                        institutions, research centers and diagnostic labs

                        {city && ` in ${city}`}.
                    </p>

                </div>

            </div>

            <div className="search-section">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

            </div>

            <div className="products-top-bar">

                <span>
                    Total Products :
                    <strong>
                        {" "}
                        {filteredProducts.length}
                    </strong>
                </span>

            </div>

            <div className="products-grid">

                {currentProducts.map(
                    (product, index) => (

                        <div
                            className="product-card"
                            key={index}
                        >

                            <div className="product-image">

                                <img
                                    src={
                                        product.image ||
                                        "https://via.placeholder.com/400x250"
                                    }
                                    alt={product.title}
                                />

                            </div>

                            <div className="product-content">
                                <h3>{product.title}</h3>

                                <div className="product-meta">

                                    <span>
                                        <strong>Brand:</strong> {product.brand}
                                    </span>

                                    <span>
                                        <strong>Model:</strong> {product.model}
                                    </span>

                                </div>

                                <div className="product-buttons">
                                    <button
                                        className="quote-btn-product"
                                        onClick={() =>
                                            window.location.href =
                                            district
                                                ? `/${district}/items/${product.slug}`
                                                : `/items/${product.slug}`
                                        }
                                    >
                                        Get Quote
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

            {/* Pagination */}

            <div className="pagination-wrapper">

                <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                </div>

                <div className="pagination">

                    <button
                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                    >
                        ◀
                    </button>

                    {getVisiblePages().map(
                        (page) => (

                            <button
                                key={page}
                                onClick={() =>
                                    setCurrentPage(
                                        page
                                    )
                                }
                                className={
                                    currentPage ===
                                        page
                                        ? "active"
                                        : ""
                                }
                            >
                                {page}
                            </button>

                        )
                    )}

                    <button
                        onClick={() =>
                            setCurrentPage(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage ===
                            totalPages
                        }
                    >
                        ▶
                    </button>

                </div>

            </div>

        </main>
    );
}