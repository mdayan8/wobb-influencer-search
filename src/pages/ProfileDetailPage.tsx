import { useEffect, useCallback, useReducer } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import {
  formatFollowers,
  formatNumber,
  formatEngagementRate,
} from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useProfileStore } from "@/stores/useProfileStore";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Check,
  Users,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";

type ProfileState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ProfileDetailResponse }
  | { status: "error"; message: string };

type ProfileAction =
  | { type: "FETCH" }
  | { type: "SUCCESS"; data: ProfileDetailResponse }
  | { type: "ERROR"; message: string };

function profileReducer(
  _state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "FETCH":
      return { status: "loading" };
    case "SUCCESS":
      return { status: "success", data: action.data };
    case "ERROR":
      return { status: "error", message: action.message };
    default:
      return _state;
  }
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [state, dispatch] = useReducer(profileReducer, { status: "idle" });

  const { addProfile, removeProfile, isInList } = useProfileStore();

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    dispatch({ type: "FETCH" });

    loadProfileByUsername(username)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          dispatch({ type: "SUCCESS", data });
        } else {
          dispatch({
            type: "ERROR",
            message: `Profile "${username}" not found`,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "ERROR", message: "Failed to load profile data" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleToggleList = useCallback(
    (profile: FullUserProfile) => {
      if (isInList(profile.user_id)) {
        removeProfile(profile.user_id);
      } else {
        addProfile({
          user_id: profile.user_id,
          username: profile.username,
          url: profile.url,
          picture: profile.picture,
          fullname: profile.fullname,
          is_verified: profile.is_verified,
          followers: profile.followers,
          engagements: profile.engagements,
          engagement_rate: profile.engagement_rate,
        });
      }
    },
    [addProfile, removeProfile, isInList]
  );

  if (!username) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium text-slate-900 dark:text-white">
            Invalid profile
          </p>
          <Link
            to="/"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (state.status === "loading") {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 dark:border-violet-800 dark:border-t-violet-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </Layout>
    );
  }

  if (state.status === "error") {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">
            {state.message}
          </p>
          <Link
            to="/"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (state.status !== "success") return null;

  const user: FullUserProfile = state.data.data.user_profile;
  const inList = isInList(user.user_id);

  const stats = [
    {
      icon: Users,
      label: "Followers",
      value: formatFollowers(user.followers),
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      icon: TrendingUp,
      label: "Engagement Rate",
      value: formatEngagementRate(user.engagement_rate),
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    ...(user.posts_count !== undefined
      ? [
          {
            icon: FileText,
            label: "Posts",
            value: formatNumber(user.posts_count),
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
        ]
      : []),
    ...(user.avg_likes !== undefined
      ? [
          {
            icon: Heart,
            label: "Avg Likes",
            value: formatFollowers(user.avg_likes),
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-500/10",
          },
        ]
      : []),
    ...(user.avg_comments !== undefined
      ? [
          {
            icon: MessageCircle,
            label: "Avg Comments",
            value: formatFollowers(user.avg_comments),
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
        ]
      : []),
    ...(user.avg_views !== undefined && user.avg_views > 0
      ? [
          {
            icon: Eye,
            label: "Avg Views",
            value: formatFollowers(user.avg_views),
            color: "text-cyan-600 dark:text-cyan-400",
            bg: "bg-cyan-50 dark:bg-cyan-500/10",
          },
        ]
      : []),
    ...(user.engagements !== undefined
      ? [
          {
            icon: BarChart3,
            label: "Total Engagements",
            value: formatFollowers(user.engagements),
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
          },
        ]
      : []),
  ];

  return (
    <Layout title={user.fullname}>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        {/* Profile header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
          {/* Banner gradient */}
          <div className="h-32 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600" />

          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-16 mb-4 flex items-end justify-between">
              <img
                src={user.picture}
                alt={`${user.fullname}'s profile picture`}
                className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg dark:border-slate-900"
              />
              <div className="flex items-center gap-2">
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    aria-label={`Visit ${user.fullname}'s profile on ${platform}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Profile
                  </a>
                )}
                <button
                  onClick={() => handleToggleList(user)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    inList
                      ? "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:hover:bg-violet-500/25"
                      : "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700"
                  }`}
                  aria-label={inList ? "Remove from list" : "Add to list"}
                >
                  {inList ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added to List
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add to List
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Name & info */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  @{user.username}
                </h1>
                <VerifiedBadge verified={user.is_verified} />
              </div>
              <p className="mt-0.5 text-base text-slate-500 dark:text-slate-400">
                {user.fullname}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {platform}
              </p>
            </div>

            {/* Description */}
            {user.description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {user.description}
              </p>
            )}

            {/* Stats grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 p-4 transition-colors hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
