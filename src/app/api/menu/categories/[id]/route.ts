import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuCategory } from "@/lib/models/menu-category.model";
import { MenuItem } from "@/lib/models/menu-item.model";

function checkAdmin(req: Request): boolean {
  const auth = req.headers.get("Authorization");
  const pin = process.env.MENU_ADMIN_PIN ?? "admin1234";
  return auth === `Bearer ${pin}`;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const { name, emoji, description, order } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const category = await MenuCategory.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        emoji: emoji || "🍽️",
        description: description?.trim() || undefined,
        order: order ?? 0,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: category._id.toString(),
        name: category.name,
        emoji: category.emoji,
        description: category.description ?? undefined,
        order: category.order,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await connectDB();
    await MenuItem.deleteMany({ category_id: id });
    const category = await MenuCategory.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
