import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ProfileStore {
  selectedProfiles: UserProfileSummary[];
  followedProfiles: Record<string, Record<string, boolean>>;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
  toggleFollow: (platform: string, userId: string) => void;
  isFollowing: (platform: string, userId: string) => boolean;
  getFollowedCount: (platform: string) => number;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      followedProfiles: {},

      addProfile: (profile) => {
        const exists = get().selectedProfiles.some(
          (p) => p.user_id === profile.user_id
        );
        if (!exists) {
          set((state) => ({
            selectedProfiles: [...state.selectedProfiles, profile],
          }));
        }
      },

      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.user_id !== userId
          ),
        }));
      },

      isInList: (userId) => {
        return get().selectedProfiles.some((p) => p.user_id === userId);
      },

      clearList: () => set({ selectedProfiles: [] }),

      toggleFollow: (platform, userId) => {
        set((state) => {
          const platformFollows = state.followedProfiles[platform] || {};
          return {
            followedProfiles: {
              ...state.followedProfiles,
              [platform]: {
                ...platformFollows,
                [userId]: !platformFollows[userId],
              },
            },
          };
        });
      },

      isFollowing: (platform, userId) => {
        return !!get().followedProfiles[platform]?.[userId];
      },

      getFollowedCount: (platform) => {
        const platformFollows = get().followedProfiles[platform] || {};
        return Object.values(platformFollows).filter(Boolean).length;
      },
    }),
    {
      name: "wobb-profile-store",
    }
  )
);
