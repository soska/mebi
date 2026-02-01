import { createContext, useContext } from "react";
import { GameStore } from "./GameStore";

export class RootStore {
  gameStore: GameStore;

  constructor() {
    this.gameStore = new GameStore();
  }
}

export const StoreContext = createContext<RootStore | null>(null);

export function useStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return store;
}

export function useGameStore(): GameStore {
  return useStore().gameStore;
}
