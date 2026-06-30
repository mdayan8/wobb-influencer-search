import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ProfileStore {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

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
    }),
    {
      name: "wobb-selected-profiles",
    }
  )
);
