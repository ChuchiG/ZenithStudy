import { create } from "zustand";

interface SettingsState {
    focusTime: number; // in minutes
    setFocusTime: (minutes: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    focusTime: 50, // Default 50 minutes

    setFocusTime: (minutes) => {
        set({ focusTime: minutes });
    },
}));
