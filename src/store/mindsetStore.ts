import { create } from "zustand";

interface MindsetState {
    effortMinutes: number;
    streak: number;
    lastSessionDate: string | null;
    addEffort: (mins: number) => void;
    checkStreak: () => void;
}

export const useMindsetStore = create<MindsetState>((set, get) => ({
    effortMinutes: 0,
    streak: 0,
    lastSessionDate: null,

    addEffort: (mins) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => ({
            effortMinutes: state.effortMinutes + mins,
            lastSessionDate: today,
        }));
        get().checkStreak();
    },

    checkStreak: () => {
        const { lastSessionDate, streak } = get();
        const today = new Date().toISOString().split("T")[0];

        if (lastSessionDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastSessionDate === yesterdayStr) {
            set({ streak: streak + 1 });
        } else if (lastSessionDate !== null) {
            set({ streak: 1 });
        }
    },
}));
