import { connectDB } from "@/lib/mongodb";
import { MenuCategory } from "@/lib/models/menu-category.model";
import { MenuItem } from "@/lib/models/menu-item.model";
import { type CategoryData } from "@/lib/menu/types";
import { MenuHero } from "@/components/menu/public/MenuHero";
import { MenuDivider } from "@/components/menu/public/MenuDivider";
import { MenuDisplay } from "@/components/menu/public/MenuDisplay";
import { MenuFooter } from "@/components/menu/public/MenuFooter";
import { CartSummary } from "@/components/menu/public/CartSummary";

async function getMenu(): Promise<CategoryData[]> {
  try {
    await connectDB();
    const [categories, items] = await Promise.all([
      MenuCategory.find().sort({ order: 1, created_at: 1 }).lean(),
      MenuItem.find({ available: true }).sort({ order: 1, created_at: 1 }).lean(),
    ]);

    return categories.map((cat) => ({
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
  } catch {
    return [];
  }
}

export default async function MenuPage() {
  const categories = await getMenu();
  const visibleCategories = categories.filter((c) => c.items.length > 0);

  return (
    <div className="min-h-screen bg-[#091a0f] text-[#f5f0e8] pb-40 sm:pb-24">
      <MenuHero />
      <MenuDivider />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <MenuDisplay categories={visibleCategories} />
      </main>

      <MenuFooter />
      <CartSummary />
    </div>
  );
}
