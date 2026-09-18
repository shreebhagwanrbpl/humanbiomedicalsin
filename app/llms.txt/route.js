import { NextResponse } from "next/server";
import { fetchFullCatalog, getDistrictData } from "@/lib/db-server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic";

const WEBSITE = "humanbiomedicalsin";
const DOMAIN = "https://humanbiomedicals.in";

export async function GET() {
    try {
        if (!adminDb) {
            return new NextResponse("Firebase Admin environment variables missing", { status: 503 });
        }

        // Districts
        let districts = [];
        try {
            const districtSnap = await getDocs(
                collection(db, "websites", WEBSITE, "districts")
            );
            districts = districtSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (e) {
            // fallback
        }

        // Master Catalog Products & Categories
        const catalogData = await fetchFullCatalog();
        const publishedProducts = catalogData.categoryProducts || [];
        const categories = catalogData.categoryList || [];

        // Categories formatted
        const categoryText =
            categories.length > 0
                ? categories
                    .map((cat) => {
                        const productList = (cat.subcategories || [])
                            .flatMap((sub) => sub.products || [])
                            .map((item) => `- ${item.title} (${item.brand || "Human Biomedicals"})`)
                            .join("\n");

                        return `
## ${cat.name || cat.category}
Category ID: ${cat.id}
Total Subcategories: ${cat.subcategories?.length || 0}
Products:
${productList || "No Products"}
`;
                    })
                    .join("\n")
                : "No Categories Found";

        // Products formatted with all specifications
        const productText =
            publishedProducts.length > 0
                ? publishedProducts
                    .map((product) => {
                        return `
# ${product.title}
Category: ${product.category || "N/A"}
Subcategory: ${product.subCategory || "N/A"}
Brand: ${product.brand || "Human Biomedicals"}
Model: ${product.model || "N/A"}
Instrument: ${product.instrument || "N/A"}
Capacity: ${product.capacity || "N/A"}
Throughput: ${product.throughput || "N/A"}
Automation: ${product.automation || "N/A"}
Usage: ${product.usage || "N/A"}
Parameters: ${product.parameters || "N/A"}
Availability: ${product.availability || "In Stock"}
Price: ${product.price ? `₹${product.price}` : "Contact for Best Quote"}
Description: ${product.desc || product.description || "High performance biomedical equipment"}
Product URL: ${DOMAIN}/items/${product.slug}
`;
                    })
                    .join("\n")
                : "No Products Found";

        // Districts formatted
        const districtText =
            districts.length > 0
                ? districts
                    .map((item) => `${DOMAIN}/${item.slug}`)
                    .join("\n")
                : "No Districts Found";

        const content = `
## Statistics
Total Products: ${publishedProducts.length}
Total Categories: ${categories.length}
Total District Pages: ${districts.length}

# Human Biomedicals
India's Premier Biomedical & Laboratory Equipment Supplier
Website: ${DOMAIN}

Company Overview:
Human Biomedicals is one of India's trusted suppliers and manufacturers of biomedical equipment, pathology instruments, hematology analyzers, biochemistry analyzers, and medical consumables.

Services:
- Biomedical Equipment Supply
- Laboratory Equipment
- Diagnostic Equipment
- Installation & AMC Support
- Calibration & Repair
- Pan India Delivery

Search Keywords:
Biomedical Equipment, Laboratory Analyzers, Hematology Analyzer, Biochemistry Analyzer, Electrolyte Analyzer, Urine Analyzer, Pathology Equipment, Medical Diagnostics India

------------------------------------------------
## Categories
${categoryText}

------------------------------------------------
## Products
${productText}

------------------------------------------------
## District Pages
${districtText}

------------------------------------------------
Sitemap: ${DOMAIN}/sitemap.xml
Robots: ${DOMAIN}/robots.txt
Contact: ${DOMAIN}/contact
Last Updated: ${new Date().toISOString()}
`;

        return new NextResponse(content, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                error: e.message,
            },
            {
                status: 500,
            }
        );
    }
}