import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Check, ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

import {
    getProduct,
    getProductsByCategory,
} from "@/data/products";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/$district/products/$product")({

    loader: async ({ params }) => {

        const snap = await getDoc(
            doc(db, "websites", "humanbiomedicalsin", "pages", "products")
        );

        const allProducts = snap.exists()
            ? snap.data().products || []
            : [];

        const publishedProducts =
            allProducts.filter(
                (p: any) => p.isPublished
            );

        // const product = getProduct(
        //     publishedProducts,
        //     params.product
        // );
        const product =
            publishedProducts.find(
                (p: any) =>
                    p.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "") === params.product
            );
        if (!product) throw notFound();

        return {
            product,

            allProducts: publishedProducts,
        };
    },

    head: ({ loaderData }) => ({

        meta: loaderData
            ? [
                {
                    title:
                        `${loaderData.product.title} | Human Biomedicals`,
                },

                {
                    name: "description",

                    content:
                        typeof loaderData.product.desc === "object"
                            ? loaderData.product.desc.text || loaderData.product.desc.richText
                            : loaderData.product.desc
                },

                {
                    property: "og:title",

                    content:
                        loaderData.product.title,
                },

                {
                    property: "og:description",

                    content:
                        typeof loaderData.product.desc === "object"
                            ? loaderData.product.desc.text || loaderData.product.desc.richText
                            : loaderData.product.desc
                },

                {
                    property: "og:image",

                    content:
                        loaderData.product.image,
                },

                {
                    name: "twitter:image",

                    content:
                        loaderData.product.image,
                },
            ]
            : [],
    }),

    notFoundComponent: () => (

        <SiteLayout>

            <div className="container mx-auto px-4 py-24 text-center">

                <h1 className="text-3xl font-bold mb-4">
                    Product not found
                </h1>

                <Button asChild>

                    <Link to="/products">
                        Back to Products
                    </Link>

                </Button>

            </div>

        </SiteLayout>
    ),

    errorComponent: ({ error }) => (

        <SiteLayout>

            <div className="container mx-auto px-4 py-24 text-center">

                <h1 className="text-3xl font-bold mb-2">
                    Something went wrong
                </h1>

                <p className="text-muted-foreground">
                    {error.message}
                </p>

            </div>

        </SiteLayout>
    ),

    component: ProductDetail,
});

function ProductDetail() {

    const { district } =
        Route.useParams();

    const {
        product,
        allProducts,
    } = Route.useLoaderData();

    const related =
        getProductsByCategory(
            allProducts,
            product.instrument
        )
            .filter(
                (p) => p.id !== product.id
            )
            .slice(0, 3);

    return (
        <SiteLayout>

            <section className="container mx-auto px-4 md:px-6 pt-10 pb-6">

                <nav className="text-sm text-muted-foreground mb-6 flex gap-2 items-center">

                    <Link
                        to="/$district"
                        params={{ district }}
                        className="hover:text-primary"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        to="/$district/items"
                        params={{ district }}
                        className="hover:text-primary"
                    >
                        Products
                    </Link>

                    <span>/</span>

                    {/* <Link
                        to="/products/category/$category"

                        params={{
                            category:
                                product.instrument?.toLowerCase(),
                        }}

                        className="hover:text-primary capitalize"
                    >

                        {product.instrument}

                    </Link> */}
                    <Link
                        to="/$district/items"
                        params={{ district }}
                        className="hover:text-primary capitalize"
                    ></Link>
                </nav>

                <div className="grid lg:grid-cols-2 gap-10">

                    {/* IMAGE */}
                    <div>

                        <div className="rounded-2xl overflow-hidden bg-muted shadow-elegant aspect-square">

                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />

                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4">

                            {[product.image, product.image, product.image].map(
                                (src, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-xl overflow-hidden border border-border bg-muted"
                                    >

                                        <img
                                            src={src}
                                            alt=""
                                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth"
                                        />

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* DETAILS */}
                    <div>

                        <span className="text-xs uppercase tracking-widest text-primary font-semibold">

                            {product.instrument}

                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 leading-tight">

                            {product.title}

                        </h1>

                        <p className="text-muted-foreground leading-relaxed mb-6">

                            {
                                typeof product.desc === "object"
                                    ? product.desc.richText
                                    : product.desc
                            }

                        </p>

                        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3">

                            Product Details

                        </h2>

                        {/* <ul className="space-y-2 mb-8">

                            {[
                                product.capacity,
                                product.throughput,
                                product.instrument,
                                product.model,
                                product.usage,
                                product.brand,
                                product.parameters,
                                product.automation,
                                product.availability,
                                product.size,
                            ]
                                .filter(Boolean)
                                .map((f, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-2 text-sm"
                                    >

                                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />

                                        <span>{f}</span>

                                    </li>
                                ))}

                        </ul> */}
                        <div className="rounded-2xl border border-border overflow-hidden">

                            <table className="w-full text-sm">

                                <tbody>

                                    {[
                                        ["Price", product.price],
                                        ["Capacity", product.capacity],
                                        ["Throughput", product.throughput],
                                        ["Instrument", product.instrument],
                                        ["Model", product.model],
                                        ["Usage", product.usage],
                                        ["Brand", product.brand],
                                        ["Parameters", product.parameters],
                                        ["Automation", product.automation],
                                        ["Availability", product.availability],
                                        ["Size", product.size],
                                    ]
                                        .filter((s) => s[1])
                                        .map((s, i) => (
                                            <tr
                                                key={s[0]}
                                                className={
                                                    i % 2 === 0
                                                        ? "bg-muted/40"
                                                        : "bg-card"
                                                }
                                            >

                                                <td className="px-5 py-4 font-medium w-1/3">

                                                    {s[0]}

                                                </td>

                                                <td className="px-5 py-4 text-muted-foreground">

                                                    {s[1]}

                                                </td>

                                            </tr>
                                        ))}

                                </tbody>

                            </table>

                        </div>

                        <div className="flex flex-wrap gap-3 pt-5">

                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-primary shadow-soft"
                            >
                                <Link
                                    to={
                                        district
                                            ? "/$district/quote"
                                            : "/quote"
                                    }
                                    params={
                                        district
                                            ? { district }
                                            : undefined
                                    }
                                    search={{
                                        product: product.title,
                                    }}
                                >
                                    Enquire Now
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                            >

                                <Link
                                    to="/$district/contact"
                                    params={{ district }}
                                >
                                    Contact Sales
                                </Link>

                            </Button>

                        </div>

                    </div>

                </div>

            </section>

            {/* SPECS */}
            {/* <section className="container mx-auto px-4 md:px-6 py-12">

                <h2 className="text-2xl font-bold mb-6">

                    Technical Specifications

                </h2>

                <div className="rounded-2xl border border-border overflow-hidden">

                    <table className="w-full text-sm">

                        <tbody>

                            {[
                                ["Price", product.price],
                                ["Capacity", product.capacity],
                                ["Throughput", product.throughput],
                                ["Instrument", product.instrument],
                                ["Model", product.model],
                                ["Usage", product.usage],
                                ["Brand", product.brand],
                                ["Parameters", product.parameters],
                                ["Automation", product.automation],
                                ["Availability", product.availability],
                                ["Size", product.size],
                            ]
                                .filter((s) => s[1])
                                .map((s, i) => (
                                    <tr
                                        key={s[0]}
                                        className={
                                            i % 2 === 0
                                                ? "bg-muted/40"
                                                : "bg-card"
                                        }
                                    >

                                        <td className="px-5 py-4 font-medium w-1/3">

                                            {s[0]}

                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">

                                            {s[1]}

                                        </td>

                                    </tr>
                                ))}

                        </tbody>

                    </table>

                </div>

            </section> */}

            {/* RELATED */}
            {related.length > 0 && (

                <section className="container mx-auto px-4 md:px-6 py-12">

                    <h2 className="text-2xl font-bold mb-6">
                        Related Products
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {related.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                district={district}
                            />
                        ))}

                    </div>

                </section>
            )}

        </SiteLayout>
    );
}