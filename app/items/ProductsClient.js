"use client";

import "./Products.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronRight, Search, Eye, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsClient({
    initialCategories = [],
    initialProducts = [],
    city = "",
    district = "",
}) {
    const [categories, setCategories] = useState(initialCategories);
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");
    const [openedCategories, setOpenedCategories] = useState({});
    const [openedSubcategories, setOpenedSubcategories] = useState({});
    const [activeCategory, setActiveCategory] = useState("");
    const [activeSubcategory, setActiveSubcategory] = useState("");
    const [pendingScroll, setPendingScroll] = useState(null);
    const [showTopButton, setShowTopButton] = useState(false);
    const [visibleCount, setVisibleCount] = useState(30);

    // Live auto-sync with /api/products on window focus or visibility change
    useEffect(() => {
        let isMounted = true;

        const syncLiveCatalog = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.success) {
                        setCategories(data.categories || []);
                        setProducts(data.products || []);
                    }
                }
            } catch (err) {
                // Silently ignore background sync errors
            }
        };

        const handleVisibilityOrFocus = () => {
            if (document.visibilityState === "visible") {
                syncLiveCatalog();
            }
        };

        window.addEventListener("focus", handleVisibilityOrFocus);
        document.addEventListener("visibilitychange", handleVisibilityOrFocus);

        // Periodic background poll every 30 seconds
        const pollInterval = setInterval(syncLiveCatalog, 30000);

        return () => {
            isMounted = false;
            window.removeEventListener("focus", handleVisibilityOrFocus);
            document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
            clearInterval(pollInterval);
        };
    }, []);

    // Update navbar height dynamically in a CSS variable to stack sticky components correctly
    useEffect(() => {
        const updateNavbarHeight = () => {
            const nav = document.querySelector(".navbar");
            if (nav) {
                document.documentElement.style.setProperty("--navbar-height", `${nav.offsetHeight}px`);
            }
        };

        updateNavbarHeight();
        window.addEventListener("resize", updateNavbarHeight);
        return () => window.removeEventListener("resize", updateNavbarHeight);
    }, []);

    // Filter products based on search term and rebuild tree
    const filteredCategories = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return categories;

        return categories
            .map((cat) => {
                const filteredSubs = (cat.subcategories || [])
                    .map((sub) => {
                        const filteredProducts = (sub.products || []).filter((p) => {
                            const text = `
                                ${p.title || ""}
                                ${p.brand || ""}
                                ${p.model || ""}
                                ${p.instrument || ""}
                                ${p.category || ""}
                                ${p.subCategory || ""}
                                ${p.parameters || ""}
                                ${p.desc || ""}
                            `.toLowerCase();
                            return text.includes(query);
                        });
                        return { ...sub, products: filteredProducts };
                    })
                    .filter((sub) => sub.products.length > 0);

                return { ...cat, subcategories: filteredSubs };
            })
            .filter((cat) => (cat.subcategories || []).length > 0);
    }, [categories, search]);

    // Flat list of filtered products for global operations and pagination checks
    const filteredProducts = useMemo(() => {
        const list = [];
        filteredCategories.forEach((cat) => {
            cat.subcategories.forEach((sub) => {
                list.push(...sub.products);
            });
        });
        return list;
    }, [filteredCategories]);

    // Reset pagination when search query changes to keep initial render light
    useEffect(() => {
        setVisibleCount(30);
    }, [search]);

    const toggleCategory = useCallback((id) => {
        setOpenedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
        setActiveCategory(id);
    }, []);

    const toggleSubcategory = useCallback((id) => {
        setOpenedSubcategories((prev) => ({ ...prev, [id]: !prev[id] }));
        setActiveSubcategory(id);
    }, []);

    const scrollToProduct = useCallback(
        (slug, categoryId, subcategoryId) => {
            // Expand the target category and subcategory
            setOpenedCategories((prev) => ({ ...prev, [categoryId]: true }));
            setOpenedSubcategories((prev) => ({ ...prev, [subcategoryId]: true }));
            setActiveCategory(categoryId);
            setActiveSubcategory(subcategoryId);

            // Find index of targeted product to adjust pagination boundary
            const index = filteredProducts.findIndex((p) => p.slug === slug);
            if (index !== -1) {
                setVisibleCount((prev) => Math.max(prev, index + 5));
            }

            setPendingScroll(slug);
        },
        [filteredProducts]
    );

    // Handle scroll trigger for pagination loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 30, filteredProducts.length));
                }
            },
            { rootMargin: "300px" }
        );

        const sentinel = document.getElementById("scroll-sentinel");
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [filteredProducts.length]);

    // Handle scroll synchronization for active category and subcategory
    useEffect(() => {
        if (filteredCategories.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: "-120px 0px -75% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    if (target.classList.contains("category-section")) {
                        const catId = target.dataset.categoryId;
                        setActiveCategory(catId);
                        setOpenedCategories((prev) => ({ ...prev, [catId]: true }));
                    } else if (target.classList.contains("subcategory-group")) {
                        const subId = target.dataset.subcategoryId;
                        const catId = target.dataset.categoryId;
                        setActiveSubcategory(subId);
                        setOpenedSubcategories((prev) => ({ ...prev, [subId]: true }));
                        setActiveCategory(catId);
                        setOpenedCategories((prev) => ({ ...prev, [catId]: true }));
                    }
                }
            });
        }, observerOptions);

        const categorySections = document.querySelectorAll(".category-section");
        const subcategoryGroups = document.querySelectorAll(".subcategory-group");

        categorySections.forEach((sec) => observer.observe(sec));
        subcategoryGroups.forEach((grp) => observer.observe(grp));

        return () => {
            categorySections.forEach((sec) => observer.unobserve(sec));
            subcategoryGroups.forEach((grp) => observer.unobserve(grp));
            observer.disconnect();
        };
    }, [filteredCategories]);

    // Handle smooth scrolling to selected product
    useEffect(() => {
        if (!pendingScroll) return;

        const timer = setTimeout(() => {
            const el = document.getElementById(pendingScroll);
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
            setPendingScroll(null);
        }, 150);

        return () => clearTimeout(timer);
    }, [pendingScroll]);

    // Back to top button visibility scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setShowTopButton(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    let globalRenderedCount = 0;

    return (
        <main className="products-page">
            <div className="products-hero">
                <div className="products-hero-content">
                    <span className="products-badge">
                        Biomedical Equipment Catalog
                    </span>
                    <h1>
                        Advanced Laboratory &amp; Diagnostic Equipment
                    </h1>
                    <p>
                        Discover premium biomedical, laboratory and hospital
                        equipment designed for healthcare institutions, research centers and
                        diagnostic labs{city && ` in ${city}`}.
                    </p>
                </div>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search equipment by title, brand, model, parameter..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="products-top-bar">
                <span>
                    Total Available Products : <strong>{filteredProducts.length}</strong>
                </span>
            </div>

            <div className="products-layout">
                {/* Left Sidebar */}
                <div id="sidebarWrapper">
                    <aside className="products-sidebar">
                        <h3 className="sidebar-title">Categories</h3>
                        <div className="accordion-wrapper">
                            {filteredCategories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    isExpanded={!!openedCategories[category.id]}
                                    toggleCategory={toggleCategory}
                                    openedSubcategories={openedSubcategories}
                                    toggleSubcategory={toggleSubcategory}
                                    activeCategory={activeCategory}
                                    activeSubcategory={activeSubcategory}
                                    scrollToProduct={scrollToProduct}
                                />
                            ))}
                        </div>
                    </aside>
                </div>

                {/* Right Product List */}
                <div className="products-right">
                    {filteredCategories.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                            <h3>No equipment found matching "{search}"</h3>
                            <p>Try clearing your search term or exploring other categories.</p>
                        </div>
                    ) : (
                        filteredCategories.map((category) => {
                            let categoryRenderedCount = 0;

                            // Filter subcategories containing products matching scroll limits
                            const subcategoriesWithVisibleProducts = (category.subcategories || [])
                                .map((sub) => {
                                    const visibleSubProducts = (sub.products || []).filter(() => {
                                        const isVisible = globalRenderedCount < visibleCount;
                                        if (isVisible) {
                                            globalRenderedCount++;
                                            categoryRenderedCount++;
                                        }
                                        return isVisible;
                                    });
                                    return { ...sub, products: visibleSubProducts };
                                })
                                .filter((sub) => sub.products.length > 0);

                            if (subcategoriesWithVisibleProducts.length === 0) return null;

                            return (
                                <section
                                    key={category.id}
                                    className="category-section"
                                    data-category-id={category.id}
                                    ref={(el) => {
                                        if (el) {
                                            const header = el.querySelector(".category-header");
                                            if (header) {
                                                el.style.setProperty("--category-header-height", `${header.offsetHeight}px`);
                                            }
                                        }
                                    }}
                                >
                                    <div className="category-header">
                                        <h2>{category.name}</h2>
                                        <span>{categoryRenderedCount} Products</span>
                                    </div>

                                    {subcategoriesWithVisibleProducts.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="subcategory-group"
                                            data-subcategory-id={sub.id}
                                            data-category-id={category.id}
                                            style={{ marginBottom: "35px" }}
                                        >
                                            <h3 className="subcategory-header-sticky">
                                                {sub.name}
                                            </h3>
                                            <div className="category-products">
                                                {sub.products.map((product) => {
                                                    const imgUrl = product.images?.[0] || product.image || "/placeholder-product.jpg";
                                                    return (
                                                        <div
                                                            key={product.id || product.slug}
                                                            id={product.slug}
                                                            className="product-row"
                                                        >
                                                            {/* IMAGE */}
                                                            <div className="product-row-image" style={{ position: "relative" }}>
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={product.title}
                                                                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }}
                                                                    loading="lazy"
                                                                />
                                                            </div>

                                                            {/* CONTENT */}
                                                            <div className="product-row-content">
                                                                <h3 className="product-title-text">{product.title}</h3>
                                                                
                                                                <div className="product-info-grid">
                                                                    {product.capacity ? (
                                                                        <div className="info-box">
                                                                            <span>Capacity</span>
                                                                            <strong>{product.capacity}</strong>
                                                                        </div>
                                                                    ) : null}
                                                                    {product.throughput ? (
                                                                        <div className="info-box">
                                                                            <span>Throughput</span>
                                                                            <strong>{product.throughput}</strong>
                                                                        </div>
                                                                    ) : null}
                                                                    {product.brand ? (
                                                                        <div className="info-box">
                                                                            <span>Brand</span>
                                                                            <strong>{product.brand}</strong>
                                                                        </div>
                                                                    ) : null}
                                                                    <div className="info-box">
                                                                        <span>Category</span>
                                                                        <strong>{product.category || sub.name || category.name}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* BUTTON */}
                                                            <div className="product-row-action">
                                                                <Link
                                                                    className="quote-btn-product"
                                                                    href={
                                                                        district
                                                                            ? `/${district}/items/${product.slug}`
                                                                            : `/items/${product.slug}`
                                                                    }
                                                                >
                                                                    View Details
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            );
                        })
                    )}

                    <div id="scroll-sentinel" style={{ height: "20px" }} />
                </div>
            </div>

            {showTopButton && (
                <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
                    <ChevronUp size={24} />
                </button>
            )}
        </main>
    );
}

// ----------------------------------------------------
// MEMOIZED ACCORDION ITEMS FOR PERFORMANCE ENGINEERING
// ----------------------------------------------------

const CategoryItem = React.memo(({
    category,
    isExpanded,
    toggleCategory,
    openedSubcategories,
    toggleSubcategory,
    activeCategory,
    activeSubcategory,
    scrollToProduct,
}) => {
    const totalCount = useMemo(() => {
        return (category.subcategories || []).reduce((acc, sub) => acc + (sub.products || []).length, 0);
    }, [category.subcategories]);

    return (
        <div className="accordion-item" key={category.id}>
            <button
                className={`accordion-header ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => toggleCategory(category.id)}
            >
                <span className="accordion-left">
                    {isExpanded ? (
                        <ChevronDown size={18} />
                    ) : (
                        <ChevronRight size={18} />
                    )}
                    {category.name}
                </span>
                <span className="accordion-count">
                    {totalCount}
                </span>
            </button>
            <div
                className={`accordion-content ${isExpanded ? "open" : ""}`}
                style={{
                    display: isExpanded ? "block" : "none",
                    height: "auto",
                    padding: isExpanded ? "10px 0 10px 15px" : "0",
                    transition: "none",
                }}
            >
                {(category.subcategories || []).map((sub) => (
                    <SubcategoryItem
                        key={sub.id}
                        subcategory={sub}
                        categoryId={category.id}
                        isExpanded={!!openedSubcategories[sub.id]}
                        toggleSubcategory={toggleSubcategory}
                        activeSubcategory={activeSubcategory}
                        scrollToProduct={scrollToProduct}
                    />
                ))}
            </div>
        </div>
    );
});

CategoryItem.displayName = "CategoryItem";

const SubcategoryItem = React.memo(({
    subcategory,
    categoryId,
    isExpanded,
    toggleSubcategory,
    activeSubcategory,
    scrollToProduct,
}) => {
    const productCount = (subcategory.products || []).length;

    return (
        <div className="subcategory-item" style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "4px", marginBottom: "4px" }}>
            <button
                className={`subcategory-header ${activeSubcategory === subcategory.id ? "active-sub" : ""}`}
                onClick={() => toggleSubcategory(subcategory.id)}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: "8px 10px 8px 5px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: "600",
                    color: activeSubcategory === subcategory.id ? "#0f4c81" : "#475569",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                    {isExpanded ? (
                        <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    ) : (
                        <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                    )}
                    {subcategory.name}
                </span>
                <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "1px 6px", borderRadius: "10px", color: "#64748b" }}>
                    {productCount}
                </span>
            </button>
            <div
                style={{
                    display: isExpanded ? "flex" : "none",
                    flexDirection: "column",
                    paddingLeft: "15px",
                    gap: "2px",
                    marginBottom: "8px",
                }}
            >
                {isExpanded && (subcategory.products || []).map((product) => (
                    <button
                        key={product.id || product.slug}
                        className="accordion-link"
                        style={{
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: "#64748b",
                            width: "100%",
                        }}
                        onClick={() =>
                            scrollToProduct(product.slug, categoryId, subcategory.id)
                        }
                    >
                        {product.title}
                    </button>
                ))}
            </div>
        </div>
    );
});

SubcategoryItem.displayName = "SubcategoryItem";
