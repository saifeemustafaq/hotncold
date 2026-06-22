"use client";

import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { type DeleteTarget } from "@/lib/menu/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: DeleteTarget | null;
  onConfirm: () => Promise<void>;
}

export function DeleteDialog({ open, onOpenChange, target, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const message = target
    ? target.type === "category"
      ? `Delete the "${target.label}" category? This will also delete all items inside it.`
      : `Delete "${target.label}" from the menu?`
    : "";

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="bg-[#1a3a27] border-[#2d5a3d]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-[#d4a017]">
            Confirm Delete
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="px-4 py-2">
          <p className="text-[#f5f0e8] text-sm leading-relaxed">{message}</p>
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
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:flex-1 bg-red-500/80 text-white hover:bg-red-500"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
