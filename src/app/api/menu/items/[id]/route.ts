import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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
    const { name, description, price, available, order } = await request.json();

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name.trim();
    if (description !== undefined)
      update.description = description?.trim() || undefined;
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { success: false, error: "Price must be a non-negative number" },
          { status: 400 }
        );
      }
      update.price = parsedPrice;
    }
    if (available !== undefined) update.available = available;
    if (order !== undefined) update.order = order;

    await connectDB();
    const item = await MenuItem.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

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
      { success: false, error: "Failed to update item" },
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
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
