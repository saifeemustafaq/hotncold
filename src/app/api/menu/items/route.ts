import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuItem } from "@/lib/models/menu-item.model";

function checkAdmin(req: Request): boolean {
  const auth = req.headers.get("Authorization");
  const pin = process.env.MENU_ADMIN_PIN ?? "admin1234";
  return auth === `Bearer ${pin}`;
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { category_id, name, description, price, available, order } =
      await request.json();

    if (!category_id || !name?.trim() || price === undefined || price === null) {
      return NextResponse.json(
        { success: false, error: "category_id, name, and price are required" },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a non-negative number" },
        { status: 400 }
      );
    }

    await connectDB();
    const item = await MenuItem.create({
      category_id,
      name: name.trim(),
      description: description?.trim() || undefined,
      price: parsedPrice,
      available: available ?? true,
      order: order ?? 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: item._id.toString(),
        category_id: item.category_id.toString(),
        name: item.name,
        description: item.description ?? undefined,
        price: item.price,
        available: item.available,
        order: item.order,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
