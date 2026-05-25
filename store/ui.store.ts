import { create } from "zustand";

type Theme = "light" | "dark";

type UiState = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  
//    test ridicule
  toggleTheme2: () =>
    set((state) => ({
      theme: state.theme === "light" ? "light" : "dark",
    })),
}));
