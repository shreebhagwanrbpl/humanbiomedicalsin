"use client";

import { usePathname } from "next/navigation";
import "./Products.css";
import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ChevronUp } from "lucide-react";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

const getCategory = (item) => {

    const title = (item.title || "").toLowerCase();

    if (title.includes("rapid"))
        return "Rapid Test Kits";

    if (title.includes("elisa"))
        return "ELISA Kits";

    if (title.includes("electrolyte"))
        return "Electrolyte Reagents";

    if (title.includes("hematology"))
        return "Hematology";

    if (title.includes("biochemistry"))
        return "Biochemistry";

    if (title.includes("immuno"))
        return "Immunoassay";

    return "Other Products";

};

export default function ItemPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const [search, setSearch] = useState("");

    const [openedCategory, setOpenedCategory] =
        useState("");

    const [activeCategory, setActiveCategory] =
        useState("");

    const [pendingScroll, setPendingScroll] =
        useState(null);

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

    const city = district
        ? district
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
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

                    const published =
                        allProducts
                            .filter(
                                (item) =>
                                    item.isPublished !== false
                            )
                            .map(
                                (
                                    item,
                                    index
                                ) => ({

                                    ...item,

                                    uid: index,

                                    slug:
                                        item.slug ||
                                        makeSlug(item.title),

                                    category:
                                        item.category ||
                                        getCategory(item),

                                })
                            );

                    setProducts(
                        published
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

    const filteredProducts =
        useMemo(() => {

            return products.filter(
                (item) => {

                    const text = `
                    ${item.title}
                    ${item.brand}
                    ${item.model}
                    ${item.category}
                    `
                        .toLowerCase();

                    return text.includes(
                        search.toLowerCase()
                    );

                }
            );

        }, [products, search]);

    const groupedProducts =
        useMemo(() => {

            const obj = {};

            filteredProducts.forEach(
                (item) => {

                    if (
                        !obj[item.category]
                    ) {

                        obj[item.category] = [];

                    }

                    obj[item.category].push(
                        item
                    );

                }
            );

            return Object.entries(obj);

        }, [filteredProducts]);

    const toggleCategory = (
        category
    ) => {

        if (
            openedCategory ===
            category
        ) {

            setOpenedCategory("");

            return;

        }

        setOpenedCategory(
            category
        );

    };

    const scrollToProduct = (
        slug,
        category
    ) => {

        setOpenedCategory(
            category
        );

        setActiveCategory(
            category
        );

        setPendingScroll(
            slug
        );

    };

    useEffect(() => {

        if (!pendingScroll)
            return;

        const timer =
            setTimeout(() => {

                const el =
                    document.getElementById(
                        pendingScroll
                    );

                if (el) {

                    el.scrollIntoView({

                        behavior: "smooth",

                        block: "start",

                    });

                }

                setPendingScroll(
                    null
                );

            }, 250);

        return () =>
            clearTimeout(timer);

    }, [
        openedCategory,
        pendingScroll,
    ]);


useEffect(() => {

    const handleScroll = () => {

        if (window.scrollY > 400) {

            setShowTopButton(true);

        } else {

            setShowTopButton(false);

        }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
        window.removeEventListener(
            "scroll",
            handleScroll
        );

}, []);

const scrollToTop = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth",

    });

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

                        Discover premium biomedical,
                        laboratory and hospital
                        equipment designed for
                        healthcare institutions,
                        research centers and
                        diagnostic labs

                        {city && ` in ${city}`}

                    </p>

                </div>

            </div>

            <div className="search-section">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
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

            <div className="products-layout">

                                <aside className="products-sidebar">

                    <h3 className="sidebar-title">

                        Categories

                    </h3>

                    <div className="accordion-wrapper">

                        {groupedProducts.map(
                            ([category, items]) => (

                                <div
                                    className="accordion-item"
                                    key={category}
                                >

                                    <button
                                        className={`accordion-header ${
                                            activeCategory === category
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleCategory(
                                                category
                                            )
                                        }
                                    >

                                        <span className="accordion-left">

                                            {openedCategory ===
                                            category ? (
                                                <ChevronDown
                                                    size={18}
                                                />
                                            ) : (
                                                <ChevronRight
                                                    size={18}
                                                />
                                            )}

                                            {category}

                                        </span>

                                        <span className="accordion-count">

                                            {items.length}

                                        </span>

                                    </button>

                                    <div
                                        className={`accordion-content ${
                                            openedCategory ===
                                            category
                                                ? "open"
                                                : ""
                                        }`}
                                    >

                                        {items.map(
                                            (
                                                product
                                            ) => (

                                                <button
                                                    key={
                                                        product.uid
                                                    }
                                                    className="accordion-link"
                                                    onClick={() =>
                                                        scrollToProduct(
                                                            product.slug,
                                                            category
                                                        )
                                                    }
                                                >

                                                    {
                                                        product.title
                                                    }

                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </aside>

                {/* RIGHT SIDE */}

                <div className="products-right">

                    {groupedProducts.map(
                        ([category, items]) => (

                            <section
                                key={category}
                                className="category-section"
                            >

                                <div className="category-header">

                                    <h2>
                                        {category}
                                    </h2>

                                    <span>

                                        {items.length} Products

                                    </span>

                                </div>

                                <div className="category-products">

                                    {items.map(
                                        (
                                            product
                                        ) => (

                                            <div
                                                key={
                                                    product.uid
                                                }
                                                id={
                                                    product.slug
                                                }
                                                className="product-row"
                                            >

                                                {/* IMAGE */}

                                                <div className="product-row-image">

                                                    <img
                                                        src={
                                                            product.image ||
                                                            "https://via.placeholder.com/400x300"
                                                        }
                                                        alt={
                                                            product.title
                                                        }
                                                    />

                                                </div>

                                                {/* CONTENT */}

                                                <div className="product-row-content">

                                                    <h3>

                                                        {
                                                            product.title
                                                        }

                                                    </h3>

                                                    <p>

                                                        {product.description ||
                                                            product.desc ||
                                                            "Premium biomedical equipment designed for hospitals, laboratories and healthcare institutions."}

                                                    </p>

                                                    <div className="product-info-grid">

                                                        <div className="info-box">

                                                            <span>

                                                                Brand

                                                            </span>

                                                            <strong>

                                                                {product.brand ||
                                                                    "N/A"}

                                                            </strong>

                                                        </div>

                                                        <div className="info-box">

                                                            <span>

                                                                Model

                                                            </span>

                                                            <strong>

                                                                {product.model ||
                                                                    "N/A"}

                                                            </strong>

                                                        </div>

                                                        <div className="info-box">

                                                            <span>

                                                                Instrument

                                                            </span>

                                                            <strong>

                                                                {product.instrument ||
                                                                    "N/A"}

                                                            </strong>

                                                        </div>


                                                                                                                <div className="info-box">

                                                            <span>

                                                                Category

                                                            </span>

                                                            <strong>

                                                                {
                                                                    product.category
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* BUTTON */}

                                                <div className="product-row-action">

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

                                        )
                                    )}

                                </div>

                            </section>

                        )
                    )}

                </div>

            </div>
                    {showTopButton && (

                        <button
                            onClick={scrollToTop}
                            className="back-to-top"
                        >

                            <ChevronUp size={24} />

                        </button>

                    )}
        </main>

    );

}