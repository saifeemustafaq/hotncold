"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/menu/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "@/components/ui/responsive-dialog";
import { Minus, Plus, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: Props) {
  const itemsMap = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const items = Object.values(itemsMap);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    clearCart();
  };

  const handleClose = () => {
    onOpenChange(false);
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 300);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={handleClose}>
      <ResponsiveDialogContent className="bg-[#0d2415] border-[#2d5a3d] text-[#f5f0e8] sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden z-[100]">
        <ResponsiveDialogHeader className="px-4 sm:px-6 pt-6">
          <ResponsiveDialogTitle className="text-[#d4a017]">
            {isSuccess ? "Order Sent Successfully! 🎉" : "Complete Your Order"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-[#8aab97]">
            {isSuccess 
              ? "Order sent for approval. You will receive an SMS and email once the kitchen approves your order."
              : "Review your items and enter your details to send the order request."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {isSuccess ? (
          <div className="p-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-[#163020] rounded-full flex items-center justify-center border border-[#2d5a3d]">
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-[#f5f0e8] font-medium">Thank you for choosing Saifee&apos;s Kitchen!</p>
            <Button 
              onClick={handleClose}
              className="mt-4 bg-[#f0c842] text-[#1a3a27] hover:bg-[#d4a017] w-full"
            >
              Back to Menu
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 no-scrollbar">
            <div className="space-y-6 pb-6">
              {/* Cart Items */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#f5f0e8] border-b border-[#1e3d28] pb-2">Your Items</h4>
                {items.length === 0 ? (
                  <p className="text-[#8aab97] text-sm italic">Your cart is empty.</p>
                ) : (
                  <ul className="space-y-3">
                    {items.map(item => {
                       let discountedPrice = item.price;
                       if (item.quantity >= 10) discountedPrice = item.price * 0.8;
                       else if (item.quantity >= 5) discountedPrice = item.price * 0.9;
                       const isDiscounted = discountedPrice < item.price;

                       return (
                        <li key={item._id} className="flex items-center justify-between gap-3 bg-[#163020] p-3 rounded-xl border border-[#1e3d28]">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {isDiscounted && (
                                <span className="text-[#a3c9b3] line-through text-xs">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                              <span className="text-[#f0c842] font-semibold text-sm">
                                {formatPrice(discountedPrice)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-[#0d2415] rounded-full border border-[#2d5a3d] px-1">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1.5 text-[#8aab97] hover:text-[#f5f0e8]"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                            <span className="w-4 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1.5 text-[#8aab97] hover:text-[#f5f0e8]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </li>
                       )
                    })}
                  </ul>
                )}
                
                {items.length > 0 && (
                  <div className="bg-[#163020] p-4 rounded-xl border border-[#d4a017]/30 mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#8aab97] text-sm">Subtotal</span>
                      <span className="text-[#f5f0e8]">{formatPrice(originalTotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#a3c9b3] text-sm">Bulk Discount</span>
                        <span className="text-[#a3c9b3]">- {formatPrice(totalDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1e3d28]">
                      <span className="font-bold text-[#f5f0e8]">Total</span>
                      <span className="font-bold text-xl text-[#f0c842]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              {items.length > 0 && (
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <h4 className="font-semibold text-[#f5f0e8] border-b border-[#1e3d28] pb-2">Your Details</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#8aab97]">Full Name *</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="bg-[#163020] border-[#2d5a3d] text-[#f5f0e8] focus-visible:ring-[#d4a017]" 
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#8aab97]">Phone *</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        required 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="bg-[#163020] border-[#2d5a3d] text-[#f5f0e8] focus-visible:ring-[#d4a017]" 
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#8aab97]">Email *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        required 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="bg-[#163020] border-[#2d5a3d] text-[#f5f0e8] focus-visible:ring-[#d4a017]" 
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#8aab97]">Delivery Address *</Label>
                    <Textarea 
                      id="address" 
                      required 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="bg-[#163020] border-[#2d5a3d] text-[#f5f0e8] focus-visible:ring-[#d4a017] min-h-[80px]" 
                      placeholder="123 Main St, Apt 4B..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[#8aab97]">Special Instructions (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="bg-[#163020] border-[#2d5a3d] text-[#f5f0e8] focus-visible:ring-[#d4a017] min-h-[60px]" 
                      placeholder="Any allergies or specific requests?"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {!isSuccess && items.length > 0 && (
          <div className="p-4 sm:px-6 border-t border-[#1e3d28] mt-auto bg-[#0d2415]">
            <Button 
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f0c842] text-[#1a3a27] hover:bg-[#d4a017] font-bold h-12 text-lg"
            >
              {isSubmitting ? "Sending Request..." : "Send Order Request"}
            </Button>
          </div>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
