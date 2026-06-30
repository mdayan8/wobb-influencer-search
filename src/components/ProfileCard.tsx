import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useProfileStore } from "@/stores/useProfileStore";
import { Plus, Check, UserPlus, UserCheck } from "lucide-react";
import clsx from "clsx";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isInList, toggleFollow, isFollowing } =
    useProfileStore();
  const inList = isInList(profile.user_id);
  const following = isFollowing(profile.user_id);

  const handleToggleList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inList) {
        removeProfile(profile.user_id);
      } else {
        addProfile(profile);
      }
    },
    [inList, profile, addProfile, removeProfile]
  );

  const handleToggleFollow = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFollow(profile.user_id);
    },
    [profile.user_id, toggleFollow]
  );

  const handleNavigate = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, profile.username, platform]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNavigate();
      }
    },
    [handleNavigate]
  );

  const engagementDisplay = useMemo(() => {
    if (profile.engagement_rate !== undefined) {
      return formatEngagementRate(profile.engagement_rate);
    }
    return null;
  }, [profile.engagement_rate]);

  return (
    <article
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`View profile of ${profile.fullname}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-violet-500/30 dark:hover:shadow-violet-500/10"
    >
      <div className="relative">
        <img
          src={profile.picture}
          alt={`${profile.fullname}'s profile picture`}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100 transition-shadow group-hover:ring-violet-100 dark:ring-slate-800 dark:group-hover:ring-violet-500/20"
        />
        {following && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 ring-2 ring-white dark:ring-slate-900">
            <UserCheck className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
          {profile.fullname}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <span>{formatFollowers(profile.followers)} followers</span>
          {engagementDisplay && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {engagementDisplay}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleFollow}
          className={clsx(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
            following
              ? "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
          aria-label={following ? `Unfollow ${profile.fullname}` : `Follow ${profile.fullname}`}
        >
          {following ? (
            <UserCheck className="h-3.5 w-3.5" />
          ) : (
            <UserPlus className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {following ? "Following" : "Follow"}
          </span>
        </button>
        <button
          onClick={handleToggleList}
          className={clsx(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
            inList
              ? "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:hover:bg-violet-500/25"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
          aria-label={
            inList
              ? `Remove ${profile.fullname} from list`
              : `Add ${profile.fullname} to list`
          }
        >
          {inList ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {inList ? "Added" : "Add"}
          </span>
        </button>
      </div>
    </article>
  );
});
