import { NextResponse } from "next/server";
import { fetchSiteData, ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeContactData(data) {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item) return item;
      const val = Array.isArray(item.value) ? item.value.join(", ") : (item.value != null ? String(item.value) : "");
      return { ...item, value: val };
    });
  }
  if (Array.isArray(data.contactInfo)) {
    return {
      ...data,
      contactInfo: data.contactInfo.map(item => {
        if (!item) return item;
        const val = Array.isArray(item.value) ? item.value.join(", ") : (item.value != null ? String(item.value) : "");
        return { ...item, value: val };
      })
    };
  }
  return data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const district = searchParams.get("district");

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'type' is required (e.g. home, contact, services, about, districts)",
        },
        { status: 400 }
      );
    }

    let data = await fetchSiteData(type, { district });
    if (type === "contact" || data?.contactInfo) {
      data = normalizeContactData(data);
    }

    return NextResponse.json(
      {
        success: true,
        type,
        website: WEBSITE_ID,
        adminApiBaseUrl: ADMIN_API_BASE_URL,
        data: data || null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("API /api/site-data error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load site data",
        data: null,
      },
      { status: 500 }
    );
  }
}
