import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// POST - Track a visitor (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, referrer, userAgent, screenRes } = body;

    if (!sessionId || !page) {
      return NextResponse.json(
        { error: "Session ID and page are required" },
        { status: 400 }
      );
    }

    // Check if visitor already exists
    let visitor = await db.visitor.findUnique({
      where: { sessionId },
    });

    // Parse user agent for device info
    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);

    if (visitor) {
      // Update existing visitor
      visitor = await db.visitor.update({
        where: { sessionId },
        data: {
          page,
          lastActive: new Date(),
          isOnline: true,
          device,
          browser,
          os,
          screenRes: screenRes || visitor.screenRes,
          updatedAt: new Date(),
        },
      });
    } else {
      // Get geolocation from IP
      const ip = request.headers.get("x-forwarded-for") || 
                 request.headers.get("x-real-ip") || 
                 "127.0.0.1";
      
      const geoData = await getGeoLocation(ip);

      // Create new visitor
      visitor = await db.visitor.create({
        data: {
          sessionId,
          country: geoData.country || "Unknown",
          countryCode: geoData.countryCode || "XX",
          city: geoData.city,
          page,
          referrer,
          userAgent,
          device,
          browser,
          os,
          screenRes,
        },
      });
    }

    // Track page view
    await db.pageView.create({
      data: {
        sessionId,
        page,
      },
    });

    return NextResponse.json({ success: true, visitor });
  } catch (error) {
    console.error("Visitor tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

// PATCH - Update visitor session (heartbeat)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, duration, page } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const updateData: {
      lastActive?: Date;
      isOnline?: boolean;
      duration?: number;
      page?: string;
    } = {
      lastActive: new Date(),
      isOnline: true,
    };

    if (duration !== undefined) updateData.duration = duration;
    if (page) updateData.page = page;

    const visitor = await db.visitor.update({
      where: { sessionId },
      data: updateData,
    });

    return NextResponse.json({ success: true, visitor });
  } catch {
    return NextResponse.json(
      { error: "Failed to update visitor" },
      { status: 500 }
    );
  }
}

// GET - Get visitor statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "24h"; // 24h, 7d, 15d, 30d

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "15d":
        startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // 24h
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get visitors in range
    const visitors = await db.visitor.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get currently online visitors
    const onlineVisitors = await db.visitor.count({
      where: { isOnline: true },
    });

    // Get unique countries
    const countryStats = await db.visitor.groupBy({
      by: ["country", "countryCode"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: { id: "desc" },
      },
    });

    // Get page views for the period
    const pageViews = await db.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Calculate stats
    const totalVisitors = visitors.length;
    const totalPageViews = pageViews.length;

    // Device breakdown
    const deviceBreakdown = await db.visitor.groupBy({
      by: ["device"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
    });

    // Browser breakdown
    const browserBreakdown = await db.visitor.groupBy({
      by: ["browser"],
      where: {
        createdAt: { gte: startDate },
        browser: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    // OS breakdown
    const osBreakdown = await db.visitor.groupBy({
      by: ["os"],
      where: {
        createdAt: { gte: startDate },
        os: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    // Hourly visitors for chart
    const hourlyData = await getHourlyVisitors(startDate, now);

    return NextResponse.json({
      onlineVisitors,
      totalVisitors,
      totalPageViews,
      countryStats,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      hourlyData,
      visitors: visitors.slice(0, 50), // Latest 50 visitors
    });
  } catch (error) {
    console.error("Fetch visitors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor data" },
      { status: 500 }
    );
  }
}

// DELETE - Mark visitors as offline (cleanup)
export async function DELETE() {
  try {
    // Mark visitors as offline if they haven't been active for 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    await db.visitor.updateMany({
      where: {
        lastActive: { lt: fiveMinutesAgo },
        isOnline: true,
      },
      data: {
        isOnline: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to cleanup visitors" },
      { status: 500 }
    );
  }
}

// Helper functions
function detectDevice(userAgent: string): string {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/ipad|tablet/i.test(ua)) return "tablet";
    return "mobile";
  }
  return "desktop";
}

function detectBrowser(userAgent: string): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("safari/") && !ua.includes("chrome")) return "Safari";
  return "Other";
}

function detectOS(userAgent: string): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  return "Other";
}

async function getGeoLocation(ip: string): Promise<{ country: string; countryCode: string; city?: string }> {
  // Default for local development
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: "Local", countryCode: "LO" };
  }

  try {
    // Use free IP geolocation API
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(3000),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || "Unknown",
        countryCode: data.country_code || "XX",
        city: data.city,
      };
    }
  } catch {
    // Fallback to another service
    try {
      const response = await fetch(`https://ipwho.is/${ip}`, {
        signal: AbortSignal.timeout(3000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            country: data.country || "Unknown",
            countryCode: data.country_code || "XX",
            city: data.city,
          };
        }
      }
    } catch {
      // Silent fail
    }
  }

  return { country: "Unknown", countryCode: "XX" };
}

async function getHourlyVisitors(startDate: Date, now: Date) {
  // Get hourly breakdown of visitors
  const visitors = await db.visitor.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
    },
  });

  // Group by hour
  const hourlyMap = new Map<string, number>();
  
  // Initialize all hours
  for (let d = new Date(startDate); d <= now; d.setHours(d.getHours() + 1)) {
    const key = d.toISOString().slice(0, 13);
    hourlyMap.set(key, 0);
  }

  // Count visitors per hour
  visitors.forEach(v => {
    const key = v.createdAt.toISOString().slice(0, 13);
    if (hourlyMap.has(key)) {
      hourlyMap.set(key, (hourlyMap.get(key) || 0) + 1);
    }
  });

  // Convert to array for chart
  return Array.from(hourlyMap.entries())
    .map(([time, count]) => ({
      time: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", hour12: true }),
      visitors: count,
    }))
    .slice(-24); // Last 24 hours
}
