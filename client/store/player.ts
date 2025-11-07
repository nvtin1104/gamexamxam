"use client";

import { create } from "zustand";

export type Player = {
    id: string;
    name: string;
};

type PlayerStore = {
    players: Player[];
    addPlayers: (names: string[]) => void;
    removePlayer: (id: string) => void;
    updatePlayer: (id: string, name: string) => void;
    setPlayers: (players: Player[]) => void;
    resetPlayers: () => void;
};

const createPlayer = (name: string): Player => ({
    id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `player_${Math.random().toString(36).slice(2, 9)}`,
    name,
});

const sanitizeName = (name: string) => name.trim();

export const usePlayerStore = create<PlayerStore>()((set) => ({
    players: [],
    addPlayers: (names) =>
        set((state) => {
            const existingNames = new Set(
                state.players.map((player) => player.name.toLowerCase())
            );

            const newPlayers = names
                .map(sanitizeName)
                .filter((name) => name.length > 0)
                .filter((name, index, array) => array.indexOf(name) === index)
                .filter((name) => !existingNames.has(name.toLowerCase()))
                .map(createPlayer);

            if (newPlayers.length === 0) {
                return state;
            }

            return {
                players: [...state.players, ...newPlayers],
            };
        }),
    removePlayer: (id) =>
        set((state) => ({
            players: state.players.filter((player) => player.id !== id),
        })),
    updatePlayer: (id, name) =>
        set((state) => ({
            players: state.players.map((player) =>
                player.id === id
                    ? { ...player, name: sanitizeName(name) }
                    : player
            ),
        })),
    setPlayers: (players) =>
        set({
            players: players.map((player) => ({
                ...player,
                name: sanitizeName(player.name),
            })),
        }),
    resetPlayers: () => set({ players: [] }),
}));