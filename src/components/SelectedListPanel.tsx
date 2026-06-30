import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/stores/useProfileStore";
import { formatFollowers } from "@/utils/formatters";
import { VerifiedBadge } from "./VerifiedBadge";
import { X, Trash2, ListX, UserCheck, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop?: boolean;
}

export const SelectedListPanel = memo(function SelectedListPanel({
  isOpen,
  onClose,
  isDesktop = false,
}: SelectedListPanelProps) {
  const { selectedProfiles, removeProfile, clearList, toggleFollow, isFollowing } =
    useProfileStore();
  const navigate = useNavigate();

  const handleProfileClick = useCallback(
    (username: string) => {
      navigate(`/profile/${username}`);
      onClose();
    },
    [navigate, onClose]
  );

  const panelContent = (
    <div className="flex h-full flex-col border-l border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4 dark:border-slate-700/60">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Selected Profiles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedProfiles.length} profile
            {selectedProfiles.length !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedProfiles.length > 0 && (
            <button
              onClick={clearList}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              aria-label="Clear all selected profiles"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
          {!isDesktop && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {selectedProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <ListX className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              No profiles selected
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Click "Add" on any profile to start your list
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {selectedProfiles.map((profile) => (
              <li
                key={profile.user_id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <button
                  onClick={() => handleProfileClick(profile.username)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-label={`View ${profile.fullname}'s profile`}
                >
                  <img
                    src={profile.picture}
                    alt={`${profile.fullname}'s profile picture`}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        @{profile.username}
                      </span>
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {profile.fullname} · {formatFollowers(profile.followers)}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => toggleFollow(profile.platform || "instagram", profile.user_id)}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isFollowing(profile.platform || "instagram", profile.user_id)
                      ? "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-400"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  }`}
                  aria-label={isFollowing(profile.platform || "instagram", profile.user_id) ? `Unfollow ${profile.fullname}` : `Follow ${profile.fullname}`}
                >
                  {isFollowing(profile.platform || "instagram", profile.user_id) ? (
                    <UserCheck className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => removeProfile(profile.user_id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  aria-label={`Remove ${profile.fullname} from list`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  // Desktop: always visible sidebar
  if (isDesktop) {
    return (
      <aside
        className="h-[calc(100vh-5rem)] w-80 shrink-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900 xl:w-96"
        role="complementary"
        aria-label="Selected profiles"
      >
        {panelContent}
      </aside>
    );
  }

  // Mobile: slide-in panel
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm"
            role="complementary"
            aria-label="Selected profiles"
          >
            {panelContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
});
