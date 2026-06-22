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
import { type CategoryData, type MenuItemData } from "@/lib/menu/types";
import { adminFetch, MENU_EMOJIS } from "@/lib/menu/api";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initial?: Partial<CategoryData>;
  pin: string;
  onSave: (cat: CategoryData & { items: MenuItemData[] }) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  initial,
  pin,
  onSave,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "🍽️");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form fields whenever the dialog opens or the target item changes
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setEmoji(initial?.emoji ?? "🍽️");
      setDescription(initial?.description ?? "");
      setError("");
    }
  }, [open, initial]);

  async function submit() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await adminFetch(
        pin,
        mode === "add"
          ? "/api/menu/categories"
          : `/api/menu/categories/${initial!._id}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          body: JSON.stringify({
            name: name.trim(),
            emoji,
            description: description.trim(),
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
            {mode === "add" ? "Add Category" : "Edit Category"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Category Name *
            </Label>
            <Input
              className={inputCls}
              placeholder="e.g. Appetizers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Emoji Icon
            </Label>
            <Input
              className={inputCls}
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍽️"
            />
            <div className="flex flex-wrap gap-1.5 mt-1">
              {MENU_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={cn(
                    "text-xl p-1.5 rounded-lg transition-colors",
                    emoji === em
                      ? "bg-[#d4a017]/20 ring-1 ring-[#d4a017]"
                      : "hover:bg-[#2d5a3d]"
                  )}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[#8aab97] text-xs font-medium uppercase tracking-wider">
              Description (optional)
            </Label>
            <Textarea
              className={cn(inputCls, "resize-none min-h-20")}
              placeholder="Short description shown under the category name"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            {loading ? "Saving…" : mode === "add" ? "Add Category" : "Save Changes"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
