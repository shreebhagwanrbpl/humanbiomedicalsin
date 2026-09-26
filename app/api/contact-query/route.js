import { NextResponse } from "next/server";
import { submitContactQuery, ADMIN_API_BASE_URL, WEBSITE_ID } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject = "", message = "", district = "jaipur", ...rest } = body || {};

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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
      email: email.trim(),
      phone: String(phone).trim(),
      subject: subject.trim(),
      message: message.trim(),
      district: district || "jaipur",
      ...rest,
      websiteId: WEBSITE_ID,
      createdAt: new Date().toISOString(),
    };

    await submitContactQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/contact-query error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit inquiry. Please try again later.",
      },
      { status: 500 }
    );
  }
}
