import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// Default settings for fallback
const defaultSettings: Record<string, string> = {
  siteName: "Niuarno",
  siteTagline: "Building Digital Experiences That Convert",
  siteDescription: "Expert web developer specializing in WordPress, Wix, and Shopify.",
  ownerName: "Saheduzzaman Nour",
  ownerRole: "Web Developer & CMS Expert",
  email: "contact@niuarno.com",
  phone: "+1 (555) 123-4567",
  location: "Available Worldwide",
  responseTime: "Within 24 Hours",
  githubUrl: "https://github.com/niuarno",
  linkedinUrl: "https://linkedin.com/in/niuarno",
  twitterUrl: "https://twitter.com/niuarno",
  heroBadge: "Available for Freelance Projects",
  heroTitle: "Building Digital Experiences That Convert",
  heroSubtitle: "A web developer specializing in WordPress, Wix, and Shopify.",
};

// GET - Fetch settings
export async function GET() {
  try {
    const settingsList = await db.siteSetting.findMany();
    
    // Convert to object
    const settings: Record<string, string> = {};
    for (const setting of settingsList) {
      settings[setting.key] = setting.value;
    }

    // If database is empty, return defaults
    if (Object.keys(settings).length === 0) {
      return NextResponse.json({ settings: defaultSettings });
    }

    // Merge with defaults for any missing keys
    const mergedSettings = { ...defaultSettings, ...settings };
    return NextResponse.json({ settings: mergedSettings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Update settings (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Settings object is required" },
        { status: 400 }
      );
    }

    // Update each setting in the database
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === "string") {
        await db.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
