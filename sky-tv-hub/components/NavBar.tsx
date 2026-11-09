import Link from "next/link";
import { FILTERS, type FilterKey } from "@/lib/providers";
import { SearchBox } from "./SearchBox";

export function NavBar({ active }: { active: FilterKey }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Sky TV Hub
          </Link>
          <nav aria-label="Filters" className="no-scrollbar flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={f.key === "all" ? "/" : `/?filter=${f.key}`}
                aria-current={f.key === active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  f.key === active
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 hover:bg-white/15"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>
        <SearchBox />
      </div>
    </header>
  );
}
