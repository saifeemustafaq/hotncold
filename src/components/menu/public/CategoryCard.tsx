import { type CategoryData } from "@/lib/menu/types";
import { MenuItemRow } from "./MenuItemRow";

interface Props {
  category: CategoryData;
}

export function CategoryCard({ category }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#2d5a3d] bg-[#1a3a27] flex flex-col">
      <div className="px-5 py-4 border-b border-[#d4a017]/40 bg-[#163020]">
        <h2 className="text-[#d4a017] font-bold text-lg tracking-widest uppercase flex items-center gap-2.5">
          <span className="text-2xl leading-none">{category.emoji}</span>
          {category.name}
        </h2>
        {category.description && (
          <p className="text-[#8aab97] text-xs mt-1 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
      <ul className="flex-1 divide-y divide-[#2d5a3d]/50">
        {category.items.map((item) => (
          <MenuItemRow key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}
