import { type CategoryData } from "@/lib/menu/types";
import { formatPrice } from "@/lib/menu/api";

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
          <li key={item._id} className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[#f5f0e8] font-medium text-sm leading-snug">
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-[#7a9a87] text-xs mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <span className="text-[#f0c842] font-bold text-sm tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                {formatPrice(item.price)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
