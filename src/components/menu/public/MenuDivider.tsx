export function MenuDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-5 px-6">
      <div className="flex-1 max-w-24 h-px bg-gradient-to-r from-transparent to-[#d4a017]/50" />
      <span className="text-[#d4a017] text-base select-none">✦</span>
      <span className="text-[#d4a017]/50 text-xs select-none">✦</span>
      <span className="text-[#d4a017] text-base select-none">✦</span>
      <div className="flex-1 max-w-24 h-px bg-gradient-to-l from-transparent to-[#d4a017]/50" />
    </div>
  );
}
