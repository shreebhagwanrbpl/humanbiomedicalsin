import { NextResponse } from "next/server";
import { submitProductQuery, ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      productName = "",
      productSlug = "",
      brand = "",
      model = "",
      category = "",
      subCategory = "",
      price = "",
      district = "Direct",
      city = "India",
      message = "",
      ...rest
    } = body || {};

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!phone || !String(phone).trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: (email || "").trim(),
      phone: String(phone).trim(),
      productName: productName.trim(),
      productSlug: productSlug.trim(),
      brand: brand.trim(),
      model: model.trim(),
      category: category.trim(),
      subCategory: subCategory.trim(),
      price: price ? String(price).trim() : "",
      district: district || "Direct",
      city: city || "India",
      message: message.trim(),
      ...rest,
      websiteId: WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    await submitProductQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Your product enquiry has been submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/product-query error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit product enquiry. Please try again later.",
      },
      { status: 500 }
    );
  }
}
