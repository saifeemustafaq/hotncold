"use client";

import { useState } from "react";
import { type CategoryData } from "@/lib/menu/types";
import { CategoryCard } from "./CategoryCard";
import { MenuEmptyState } from "./MenuEmptyState";
import { useCartStore } from "@/lib/store/cart";

interface Props {
  categories: CategoryData[];
}

export function MenuDisplay({ categories }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?._id || "");
  const cartItemsCount = useCartStore((state) => Object.keys(state.items).length);

  if (categories.length === 0) {
    return <MenuEmptyState />;
  }

  const activeCategory = categories.find(c => c._id === activeCategoryId) || categories[0];

  return (
    <>
      {/* Desktop Grid View */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>

      {/* Mobile Tab View */}
      <div className="sm:hidden flex flex-col gap-4">
        <CategoryCard category={activeCategory} />
        
        {/* Mobile Bottom Nav for Categories */}
        <div 
          className="fixed left-0 right-0 bg-[#0d2415] border-t border-[#1e3d28] p-2 z-30 overflow-x-auto no-scrollbar shadow-[0_-4px_10px_rgba(0,0,0,0.2)] transition-all duration-300"
          style={{ 
            bottom: cartItemsCount > 0 ? '90px' : '0px',
            transform: 'translateY(0)' // We'll let the cart summary slide down over it, but this stays put
          }}
        >
          <div className="flex items-center gap-2 px-2 w-max">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategoryId(category._id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                  activeCategoryId === category._id
                    ? "bg-[#d4a017] text-[#1a3a27]"
                    : "bg-[#163020] text-[#8aab97] border border-[#2d5a3d]"
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
