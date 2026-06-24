"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/menu/api";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  item: {
    _id: string;
    name: string;
    description?: string;
    price: number;
  };
}

export function MenuItemRow({ item }: Props) {
  const [mounted, setMounted] = useState(false);
  const quantity = useCartStore((state) => state.items[item._id]?.quantity || 0);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDecrease = () => {
    updateQuantity(item._id, quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity === 0) {
      useCartStore.getState().addItem(item);
    } else {
      updateQuantity(item._id, quantity + 1);
    }
  };

  // Bulk discount logic: If quantity >= 5, 10% off. If quantity >= 10, 20% off.
  const getDiscountedPrice = (price: number, qty: number) => {
    if (qty >= 10) return price * 0.8;
    if (qty >= 5) return price * 0.9;
    return price;
  };

  const currentPrice = getDiscountedPrice(item.price, quantity > 0 ? quantity : 1);
  const isDiscounted = currentPrice < item.price;

  return (
    <li className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[#f5f0e8] font-medium text-sm leading-snug">
          {item.name}
        </p>
        {item.description && (
          <p className="text-[#7a9a87] text-xs mt-1 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className={`font-bold text-sm tabular-nums whitespace-nowrap ${mounted && isDiscounted ? 'text-[#a3c9b3] line-through text-xs' : 'text-[#f0c842]'}`}>
            {formatPrice(item.price)}
          </span>
          {mounted && isDiscounted && (
            <span className="text-[#f0c842] font-bold text-sm tabular-nums whitespace-nowrap">
              {formatPrice(currentPrice)} <span className="text-xs text-[#d4a017] ml-1">(Bulk Price!)</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {mounted && quantity > 0 ? (
          <div className="flex items-center bg-[#163020] rounded-full border border-[#2d5a3d]">
            <button
              onClick={handleDecrease}
              className="p-1.5 text-[#f5f0e8] hover:text-[#d4a017] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-[#f5f0e8] tabular-nums">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 text-[#f5f0e8] hover:text-[#d4a017] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleIncrease}
            className="px-4 py-1.5 text-sm font-medium text-[#1a3a27] bg-[#f0c842] hover:bg-[#d4a017] rounded-full transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </li>
  );
}
