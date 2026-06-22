import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuCategory } from "@/lib/models/menu-category.model";
import { MenuItem } from "@/lib/models/menu-item.model";

function checkAdmin(req: Request): boolean {
  const auth = req.headers.get("Authorization");
  const pin = process.env.MENU_ADMIN_PIN ?? "admin1234";
  return auth === `Bearer ${pin}`;
}

export async function GET() {
  try {
    await connectDB();
    const categories = await MenuCategory.find()
      .sort({ order: 1, created_at: 1 })
      .lean();
    const items = await MenuItem.find()
      .sort({ order: 1, created_at: 1 })
      .lean();

    const data = categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      emoji: cat.emoji,
      description: cat.description ?? undefined,
      order: cat.order,
      items: items
        .filter((item) => item.category_id.toString() === cat._id.toString())
        .map((item) => ({
          _id: item._id.toString(),
          category_id: item.category_id.toString(),
          name: item.name,
          description: item.description ?? undefined,
          price: item.price,
          available: item.available,
          order: item.order,
        })),
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { name, emoji, description, order } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const category = await MenuCategory.create({
      name: name.trim(),
      emoji: emoji || "🍽️",
      description: description?.trim() || undefined,
      order: order ?? 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: category._id.toString(),
        name: category.name,
        emoji: category.emoji,
        description: category.description ?? undefined,
        order: category.order,
        items: [],
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
