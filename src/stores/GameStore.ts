import { makeAutoObservable, reaction } from "mobx";
import { Game, type SerializedGame } from "./Game";

const STORAGE_KEY = "mebi-games";

export class GameStore {
  games: Map<string, Game> = new Map();
  activeGameId: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
    this.setupPersistence();
  }

  get gamesList(): Game[] {
    return Array.from(this.games.values());
  }

  get activeGame(): Game | null {
    return this.activeGameId ? (this.games.get(this.activeGameId) ?? null) : null;
  }

  get activeGameIndex(): number {
    if (!this.activeGameId) return -1;
    return this.gamesList.findIndex((g) => g.id === this.activeGameId);
  }

  get allGamesCompleted(): boolean {
    if (this.games.size === 0) return false;
    return this.gamesList.every((g) => g.status === "won" || g.status === "lost");
  }

  createGames(textos: string[]): string {
    this.games.clear();

    const newGames = textos
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((texto) => new Game(texto));

    newGames.forEach((game) => {
      this.games.set(game.id, game);
    });

    if (newGames.length > 0) {
      this.activeGameId = newGames[0].id;
      return newGames[0].id;
    }

    return "";
  }

  setActiveGame(gameId: string): void {
    if (this.games.has(gameId)) {
      this.activeGameId = gameId;
    }
  }

  setActiveGameByIndex(index: number): void {
    const game = this.gamesList[index];
    if (game) {
      this.activeGameId = game.id;
    }
  }

  getGameByIndex(index: number): Game | undefined {
    return this.gamesList[index];
  }

  resetAllGames(): void {
    this.gamesList.forEach((game) => game.reset());
    if (this.gamesList.length > 0) {
      this.activeGameId = this.gamesList[0].id;
    }
  }

  clearAllGames(): void {
    this.games.clear();
    this.activeGameId = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as {
          games: SerializedGame[];
          activeGameId: string | null;
        };

        data.games.forEach((serialized) => {
          const game = Game.deserialize(serialized);
          this.games.set(game.id, game);
        });

        this.activeGameId = data.activeGameId;
      }
    } catch (e) {
      console.error("Failed to load games from storage:", e);
    }
  }

  private setupPersistence(): void {
    reaction(
      () => this.serialize(),
      (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      },
      { delay: 100 }
    );
  }

  private serialize() {
    return {
      games: this.gamesList.map((g) => g.serialize()),
      activeGameId: this.activeGameId,
    };
  }
}
