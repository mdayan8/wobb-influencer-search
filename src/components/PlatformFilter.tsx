import { type Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { SearchBar } from "./SearchBar";
import { Instagram, Youtube, Music2 } from "lucide-react";
import clsx from "clsx";
import type { UserProfileSummary } from "@/types";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  profiles: UserProfileSummary[];
}

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <Music2 className="h-4 w-4" />,
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
  profiles,
}: PlatformFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <nav
        className="flex items-center justify-center gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/80"
        aria-label="Platform filter"
      >
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={clsx(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
              selected === p
                ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-violet-400 dark:ring-slate-600/5"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
            aria-pressed={selected === p}
          >
            {platformIcons[p]}
            {getPlatformLabel(p)}
          </button>
        ))}
      </nav>

      <div className="mx-auto max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          profiles={profiles}
        />
      </div>
    </div>
  );
}
