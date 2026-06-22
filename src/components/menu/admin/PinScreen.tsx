"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onAuth: (pin: string) => void;
}

export function PinScreen({ onAuth }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Send empty name so the server validates auth first (401) then rejects name (400)
      const res = await fetch("/api/menu/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pin}`,
        },
        method: "POST",
        body: JSON.stringify({ name: "" }),
      });
      if (res.status === 401) {
        setError("Incorrect PIN. Please try again.");
      } else {
        onAuth(pin);
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#091a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1a3a27] border border-[#2d5a3d] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <p className="text-[#d4a017] text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            ✦ Admin Access ✦
          </p>
          <h1 className="text-[#f5f0e8] text-2xl font-bold">Menu Admin</h1>
          <p className="text-[#7a9a87] text-sm mt-1">Enter your admin PIN to continue</p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            className="h-12 text-base bg-[#0f2118] border-[#2d5a3d] text-[#f5f0e8] placeholder:text-[#4a6a56] focus-visible:border-[#d4a017]"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={submit}
            disabled={loading || !pin.trim()}
            className="w-full bg-[#d4a017] text-[#0a1f12] hover:bg-[#f0c842] font-bold"
            size="lg"
          >
            {loading ? "Verifying…" : "Enter Admin"}
          </Button>
        </div>
      </div>
    </div>
  );
}
