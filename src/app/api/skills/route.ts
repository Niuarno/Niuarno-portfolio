import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niuarno-admin-2024";

// GET - Fetch skills
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Fetch skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST - Create new skill (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, level, icon, category } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Get the max order
    const maxOrder = await db.skill.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    const skill = await db.skill.create({
      data: {
        name,
        level: level || 80,
        icon: icon || "Code",
        category: category || "General",
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, skill }, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}

// PATCH - Update skill (admin only)
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
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    const skill = await db.skill.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// DELETE - Delete skill (admin only)
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
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    await db.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
