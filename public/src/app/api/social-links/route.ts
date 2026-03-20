import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// GET - Fetch social links
export async function GET() {
  try {
    const socialLinks = await db.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ socialLinks });
  } catch (error) {
    console.error("Fetch social links error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}
