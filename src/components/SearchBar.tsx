import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import type { UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  profiles?: UserProfileSummary[];
  onProfileSelect?: (username: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by username or name...",
  profiles = [],
  onProfileSelect,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wobb-recent-searches") || "[]");
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    const query = value.toLowerCase();
    return profiles
      .filter(
        (p) =>
          p.username.toLowerCase().includes(query) ||
          p.fullname.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [value, profiles]);

  const trendingProfiles = useMemo(() => {
    return [...profiles]
      .sort((a, b) => (b.followers || 0) - (a.followers || 0))
      .slice(0, 5);
  }, [profiles]);

  const showDropdown = isFocused && (value.length >= 2 || recentSearches.length > 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (query: string) => {
      onChange(query);
      setIsFocused(false);
      if (query && !recentSearches.includes(query)) {
        const updated = [query, ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("wobb-recent-searches", JSON.stringify(updated));
      }
    },
    [onChange, recentSearches]
  );

  const handleProfileClick = useCallback(
    (username: string) => {
      if (onProfileSelect) {
        onProfileSelect(username);
      }
      setIsFocused(false);
      if (username && !recentSearches.includes(username)) {
        const updated = [username, ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("wobb-recent-searches", JSON.stringify(updated));
      }
    },
    [onProfileSelect, recentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("wobb-recent-searches");
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`relative rounded-xl border transition-all duration-200 ${
          isFocused
            ? "border-violet-300 ring-2 ring-violet-500/20 shadow-lg shadow-violet-500/5"
            : "border-slate-200 shadow-sm"
        } dark:border-slate-700`}
      >
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          aria-label="Search influencers"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
          className="w-full rounded-xl bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            role="listbox"
          >
            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Profiles
                  </span>
                </div>
                <ul>
                  {suggestions.map((profile) => (
                    <li key={profile.user_id}>
                      <button
                        onClick={() => handleProfileClick(profile.username)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        role="option"
                      >
                        <img
                          src={profile.picture}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              @{profile.username}
                            </span>
                            <VerifiedBadge verified={profile.is_verified} />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {profile.fullname} · {formatFollowers(profile.followers)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent searches */}
            {!value && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    Recent searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    Clear
                  </button>
                </div>
                <ul>
                  {recentSearches.map((search) => (
                    <li key={search}>
                      <button
                        onClick={() => handleSelect(search)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {search}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trending */}
            {!value && recentSearches.length === 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2 dark:border-slate-800">
                  <TrendingUp className="h-3 w-3 text-violet-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Trending profiles
                  </span>
                </div>
                <ul>
                  {trendingProfiles.map((profile, i) => (
                    <li key={profile.user_id}>
                      <button
                        onClick={() => handleProfileClick(profile.username)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                          {i + 1}
                        </span>
                        <img
                          src={profile.picture}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              @{profile.username}
                            </span>
                            <VerifiedBadge verified={profile.is_verified} />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFollowers(profile.followers)} followers
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results */}
            {value && value.length >= 2 && suggestions.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No profiles found for "{value}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
