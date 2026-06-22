"use client";

import { Button } from "@/components/ui/button";

interface Props {
  onAddCategory: () => void;
}

export function AdminEmptyState({ onAddCategory }: Props) {
  return (
    <div className="text-center py-20 bg-[#1a3a27] rounded-2xl border border-dashed border-[#2d5a3d]">
      <p className="text-4xl mb-3 select-none">🍽️</p>
      <p className="text-[#8aab97] text-base font-medium">No categories yet</p>
      <p className="text-[#4a6a56] text-sm mt-1">Start by adding your first menu category</p>
      <Button
        onClick={onAddCategory}
        className="mt-5 bg-[#d4a017] text-[#0a1f12] hover:bg-[#f0c842]"
      >
        Add Category
      </Button>
    </div>
  );
}
