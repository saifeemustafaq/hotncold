export function MenuFooter() {
  return (
    <footer className="border-t border-[#1e3d28] py-8 text-center px-4">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-12 bg-[#d4a017]/30" />
        <span className="text-[#d4a017]/60 text-xs select-none">✦</span>
        <div className="h-px w-12 bg-[#d4a017]/30" />
      </div>
      <p className="text-[#4a6a56] text-xs">
        © {new Date().getFullYear()} Saifee&apos;s Kitchen &nbsp;·&nbsp; All orders by appointment
      </p>
    </footer>
  );
}
