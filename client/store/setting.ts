"use client";

import { create } from "zustand";

export type FlipCardSettings = {
    delay: number;
    shuffleCount: number;
    shuffleDelay: number;
    animationDuration: number;
    isMultiplayer: boolean;
};

type SettingStore = {
    flipCardSettings: FlipCardSettings;
    setFlipCardSettings: (settings: Partial<FlipCardSettings>) => void;
};

export const DEFAULT_FLIP_CARD_SETTINGS: FlipCardSettings = {
    delay: 500,
    shuffleCount: 4,
    shuffleDelay: 500,
    animationDuration: 500,
    isMultiplayer: true,
};

export const useSettingStore = create<SettingStore>()((set) => ({
    flipCardSettings: { ...DEFAULT_FLIP_CARD_SETTINGS },
    setFlipCardSettings: (settings) =>
        set((state) => ({
            flipCardSettings: {
                ...state.flipCardSettings,
                ...settings,
            },
        })),
}));
