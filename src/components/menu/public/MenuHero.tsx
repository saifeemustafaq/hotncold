export function MenuHero() {
  return (
    <header className="relative overflow-hidden bg-[#0d2415]">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #d4a017 0, #d4a017 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10 text-center">
        <p className="text-[#d4a017] text-xs font-semibold tracking-[0.35em] uppercase mb-3">
          ✦ &nbsp; Fine Catering &nbsp; ✦
        </p>
        <h1 className="text-[#f5f0e8] text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Saifee&apos;s Kitchen
        </h1>
        <p className="text-[#8aab97] text-sm sm:text-base mt-3 leading-relaxed">
          Authentic flavors, lovingly crafted for every occasion
        </p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#d4a017]/10 border border-[#d4a017]/30 rounded-full px-4 py-2">
            <span className="text-[#d4a017] text-sm">🎉</span>
            <span className="text-[#d4a017] text-sm font-medium">
              Bulk Order Discounts: 10% off (5+ items) • 20% off (10+ items)
            </span>
          </div>
          <p className="text-[#8aab97] text-xs">
            Order more to save more! The discount will be applied automatically.
          </p>
        </div>
      </div>
    </header>
  );
}
