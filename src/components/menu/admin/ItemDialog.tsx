"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type MenuItemData } from "@/lib/menu/types";
import { adminFetch } from "@/lib/menu/api";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  categoryId: string;
  initial?: Partial<MenuItemData>;
  pin: string;
  onSave: (item: MenuItemData) => void;
}

export function ItemDialog({
  open,
  onOpenChange,
  mode,
  categoryId,
  initial,
  pin,
  onSave,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial?.price !== undefined ? String(initial.price) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form fields whenever the dialog opens or the target item changes
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setPrice(initial?.price !== undefined ? String(initial.price) : "");
      setError("");
    }
  }, [open, initial]);

  async function submit() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Enter a valid price");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(
        pin,
        mode === "add" ? "/api/menu/items" : `/api/menu/items/${initial!._id}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          body: JSON.stringify({
            category_id: categoryId,
            name: name.trim(),
            description: description.trim(),
            price: parsedPrice,
          }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Request failed");
      onSave(json.data);
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "h-11 bg-[#0f2118] border-[#2d5a3d] text-[#f5f0e8] placeholder:text-[#4a6a56] focus-visible:border-[#d4a017]";

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="bg-[#1a3a27] border-[#2d5a3d]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-[#d4a017]">
            {mode === "add" ? "Add Item" : "Edit Item"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Item Name *
            </Label>
            <Input
              className={inputCls}
              placeholder="e.g. Chicken Biryani"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Description (optional)
            </Label>
            <Textarea
              className={cn(inputCls, "resize-none min-h-20")}
              placeholder="Brief description of the item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Price *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aab97] text-sm select-none z-10">
                $
              </span>
              <Input
                className={cn(inputCls, "pl-7")}
                placeholder="0.00"
                value={price}
                type="number"
                min="0"
                step="0.01"
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <ResponsiveDialogFooter className="flex flex-col-reverse gap-2 px-4 pt-2 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 border-[#2d5a3d] text-[#8aab97] hover:bg-[#2d5a3d] hover:text-[#f5f0e8]"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#d4a017] text-[#0a1f12] hover:bg-[#f0c842]"
          >
            {loading ? "Saving…" : mode === "add" ? "Add Item" : "Save Changes"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
