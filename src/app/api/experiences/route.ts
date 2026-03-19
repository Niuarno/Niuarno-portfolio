import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// GET - Fetch experiences
export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Fetch experiences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST - Create new experience (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { year, title, description } = body;

    if (!year || !title) {
      return NextResponse.json(
        { error: "Year and title are required" },
        { status: 400 }
      );
    }

    // Get the max order
    const maxOrder = await db.experience.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    const experience = await db.experience.create({
      data: {
        year,
        title,
        description: description || "",
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, experience }, { status: 201 });
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

// PATCH - Update experience (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    const experience = await db.experience.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

// DELETE - Delete experience (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    await db.experience.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
