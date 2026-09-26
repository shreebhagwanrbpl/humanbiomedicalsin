import { NextResponse } from "next/server";
import { fetchFullCatalog, ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const data = await fetchFullCatalog();
    return NextResponse.json(
      {
        success: true,
        website: WEBSITE_ID,
        adminApiBaseUrl: ADMIN_API_BASE_URL,
        totalCount: data.totalCount,
        categories: data.categoryList,
        products: data.categoryProducts,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch products",
        products: [],
      },
      {
        status: 500,
      }
    );
  }
}
