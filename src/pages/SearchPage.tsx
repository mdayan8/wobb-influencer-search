import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { SelectedListPanel } from "@/components/SelectedListPanel";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useProfileStore } from "@/stores/useProfileStore";
import { List, Users, TrendingUp } from "lucide-react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlatform = (searchParams.get("platform") as Platform) || "instagram";
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const { selectedProfiles, followedProfiles } = useProfileStore();

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const followedCount = useMemo(
    () => Object.values(followedProfiles[platform] || {}).filter(Boolean).length,
    [followedProfiles, platform]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
    setSearchParams({ platform: p }, { replace: true });
  }, [setSearchParams]);

  return (
    <Layout title="Find Influencers">
      <div className="flex gap-6">
        {/* Main content */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {/* Hero section */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Discover Influencers
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Browse top creators across Instagram, YouTube, and TikTok
            </p>

            {/* Quick stats */}
            <div className="mt-3 flex items-center justify-center gap-5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Users className="h-3.5 w-3.5" />
                <span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {allProfiles.length}
                  </span>{" "}
                  creators
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    {followedCount}
                  </span>{" "}
                  followed
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <List className="h-3.5 w-3.5" />
                <span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedProfiles.length}
                  </span>{" "}
                  in list
                </span>
              </div>
            </div>
          </div>

          <PlatformFilter
            selected={platform}
            onChange={handlePlatformChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            profiles={allProfiles}
          />

          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {allProfiles.length}
              </span>{" "}
              profiles
            </p>

            {/* Mobile toggle for selected list */}
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 lg:hidden"
              aria-label="Open selected profiles panel"
            >
              <List className="h-3.5 w-3.5" />
              {selectedProfiles.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
                  {selectedProfiles.length}
                </span>
              )}
            </button>
          </div>

          <ProfileList profiles={filtered} platform={platform} />
        </div>

        {/* Desktop sidebar */}
        <div className="hidden shrink-0 lg:block">
          <SelectedListPanel
            isOpen={true}
            onClose={() => setPanelOpen(false)}
            isDesktop
          />
        </div>

        {/* Mobile panel */}
        <SelectedListPanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </div>
    </Layout>
  );
}
