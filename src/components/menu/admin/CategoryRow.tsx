"use client";

import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import { type CategoryData, type MenuItemData } from "@/lib/menu/types";
import { formatPrice } from "@/lib/menu/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Props {
  category: CategoryData;
  expanded: boolean;
  onToggleExpand: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItemData) => void;
  onDeleteItem: (item: MenuItemData) => void;
  onToggleAvailable: (item: MenuItemData) => void;
}

export function CategoryRow({
  category,
  expanded,
  onToggleExpand,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailable,
}: Props) {
  return (
    <div className="bg-[#1a3a27] border border-[#2d5a3d] rounded-2xl overflow-hidden">
      {/* Category header row */}
      <div className="flex items-center gap-3 px-4 py-3.5 min-h-[52px]">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
        >
          {expanded ? (
            <ChevronDown className="size-4 text-[#d4a017] shrink-0" />
          ) : (
            <ChevronRight className="size-4 text-[#8aab97] shrink-0" />
          )}
          <span className="text-xl leading-none shrink-0">{category.emoji}</span>
          <span className="text-[#f5f0e8] font-semibold text-sm truncate">
            {category.name}
          </span>
          <Badge
            className="shrink-0 bg-[#2d5a3d] text-[#8aab97] border-none text-xs"
          >
            {category.items.length} {category.items.length !== 1 ? "items" : "item"}
          </Badge>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditCategory}
            title="Edit category"
            className="text-[#8aab97] hover:text-[#d4a017] hover:bg-[#2d5a3d]"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteCategory}
            title="Delete category"
            className="text-[#8aab97] hover:text-red-400 hover:bg-[#2d5a3d]"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Items list */}
      {expanded && (
        <div className="border-t border-[#2d5a3d]">
          {category.items.length === 0 ? (
            <p className="text-[#4a6a56] text-sm text-center py-4">No items yet</p>
          ) : (
            <ul className="divide-y divide-[#2d5a3d]/50">
              {category.items.map((item) => (
                <li
                  key={item._id}
                  className={`flex items-center gap-3 px-4 py-4 min-h-[56px] ${!item.available ? "opacity-50" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f5f0e8] text-sm font-medium truncate">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-[#7a9a87] text-xs mt-0.5 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[#f0c842] text-sm font-bold tabular-nums shrink-0">
                    {formatPrice(item.price)}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => onToggleAvailable(item)}
                      size="sm"
                      title={item.available ? "Mark unavailable" : "Mark available"}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditItem(item)}
                      title="Edit item"
                      className="text-[#8aab97] hover:text-[#d4a017] hover:bg-[#2d5a3d]"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteItem(item)}
                      title="Delete item"
                      className="text-[#8aab97] hover:text-red-400 hover:bg-[#2d5a3d]"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Add item button */}
          <div className="px-4 py-3 border-t border-[#2d5a3d]/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              className="flex items-center gap-1.5 text-[#d4a017] hover:text-[#f0c842] hover:bg-transparent font-medium px-0"
            >
              <Plus className="size-3.5" />
              Add Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
