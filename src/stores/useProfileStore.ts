import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ProfileStore {
  selectedProfiles: UserProfileSummary[];
  followedProfiles: Record<string, boolean>;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getFollowedCount: () => number;
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

      toggleFollow: (userId) => {
        set((state) => ({
          followedProfiles: {
            ...state.followedProfiles,
            [userId]: !state.followedProfiles[userId],
          },
        }));
      },

      isFollowing: (userId) => {
        return !!get().followedProfiles[userId];
      },

      getFollowedCount: () => {
        return Object.values(get().followedProfiles).filter(Boolean).length;
      },
    }),
    {
      name: "wobb-profile-store",
    }
  )
);
