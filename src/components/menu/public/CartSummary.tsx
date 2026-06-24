"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/menu/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "./CheckoutModal";

export function CartSummary() {
  const itemsMap = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const items = Object.values(itemsMap);
  
  if (items.length === 0) return null;

  let originalTotal = 0;
  let finalTotal = 0;

  items.forEach(item => {
    const qty = item.quantity;
    originalTotal += item.price * qty;
    
    let discountedPrice = item.price;
    if (qty >= 10) discountedPrice = item.price * 0.8;
    else if (qty >= 5) discountedPrice = item.price * 0.9;
    
    finalTotal += discountedPrice * qty;
  });

  const totalDiscount = originalTotal - finalTotal;

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-[#163020] border-t border-[#d4a017]/40 p-4 shadow-lg z-[40] transition-transform duration-300 ${isCheckoutOpen ? 'translate-y-[150%]' : 'translate-y-0'}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#f5f0e8] font-bold text-lg leading-none">Your Order</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[#8aab97] text-sm">
                {items.reduce((acc, item) => acc + item.quantity, 0)} items
              </p>
              <span className="text-[#2d5a3d]">•</span>
              <span className="text-[#f0c842] font-bold tabular-nums">
                {formatPrice(finalTotal)}
              </span>
            </div>
            {totalDiscount > 0 && (
              <p className="text-[#d4a017] text-xs font-medium mt-0.5 truncate">
                Saved {formatPrice(totalDiscount)} with bulk discounts! 🎉
              </p>
            )}
          </div>
          
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="shrink-0 bg-[#f0c842] text-[#1a3a27] hover:bg-[#d4a017] font-bold px-6 py-3 h-auto rounded-xl shadow-md"
          >
            View Cart
          </Button>
        </div>
      </div>

      <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
