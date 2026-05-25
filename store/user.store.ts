import { UserDTO } from "@/types";
import { create } from "zustand";

type UserState = {
  user: UserDTO | null;
  setUser: (user: UserDTO) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
