"use client";

import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[#0d2415] border-b border-[#1e3d28]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <UtensilsCrossed className="size-4 text-[#d4a017]" />
          <span className="text-[#f5f0e8] font-bold text-sm">Menu Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8aab97] text-xs hover:text-[#f5f0e8] hover:bg-[#1a3a27] border border-transparent hover:border-[#2d5a3d]"
            render={<a href="/" target="_blank" />}
          >
            View Menu ↗
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-[#8aab97] text-xs hover:text-red-400 hover:bg-[#1a3a27]"
          >
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
}
