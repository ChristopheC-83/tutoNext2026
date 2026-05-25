import { create } from "zustand";


//  on définit le type de notre state
type AppState = {
	open: boolean;
	toggleOpen: () => void;
	openSidebar: () => void;
	closeSidebar: () => void;
};

export const useAppStore = create<AppState>((set) => ({
	open: true,
	toggleOpen: () => set((state) => ({ open: !state.open })),
	openSidebar: () => set({ open: true }),
	closeSidebar: () => set({ open: false }),
}));