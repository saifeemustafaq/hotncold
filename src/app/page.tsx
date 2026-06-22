import { connectDB } from "@/lib/mongodb";
import { MenuCategory } from "@/lib/models/menu-category.model";
import { MenuItem } from "@/lib/models/menu-item.model";
import { type CategoryData } from "@/lib/menu/types";
import { MenuHero } from "@/components/menu/public/MenuHero";
import { MenuDivider } from "@/components/menu/public/MenuDivider";
import { CategoryCard } from "@/components/menu/public/CategoryCard";
import { MenuEmptyState } from "@/components/menu/public/MenuEmptyState";
import { MenuFooter } from "@/components/menu/public/MenuFooter";

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
    <div className="min-h-screen bg-[#091a0f] text-[#f5f0e8]">
      <MenuHero />
      <MenuDivider />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {visibleCategories.length === 0 ? (
          <MenuEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </main>

      <MenuFooter />
    </div>
  );
}
