import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

export type GameStatus = "pending" | "playing" | "revealed" | "won" | "lost";

export interface SerializedGame {
  id: string;
  texto: string;
  guessedLetters: string[];
  status: GameStatus;
}

export class Game {
  id: string;
  texto: string;
  guessedLetters: Set<string> = new Set();
  status: GameStatus = "pending";

  static MAX_GUESSES = 4;

  constructor(texto: string, id?: string) {
    this.id = id ?? nanoid(8);
    this.texto = texto.toUpperCase().trim();
    makeAutoObservable(this);
  }

  get normalizedTexto(): string {
    return this.texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  get words(): string[] {
    return this.texto.split(/\s+/);
  }

  get uniqueLetters(): Set<string> {
    const letters = this.normalizedTexto.replace(/[^A-ZÑ]/g, "");
    return new Set(letters);
  }

  get guessCount(): number {
    return this.guessedLetters.size;
  }

  get canGuess(): boolean {
    return this.status === "playing" && this.guessCount < Game.MAX_GUESSES;
  }

  start(): void {
    if (this.status === "pending") {
      this.status = "playing";
    }
  }

  get isComplete(): boolean {
    if (this.status !== "playing") return true;
    for (const letter of this.uniqueLetters) {
      if (!this.guessedLetters.has(letter)) return false;
    }
    return true;
  }

  get gameOver(): boolean {
    return this.status === "won" || this.status === "lost";
  }

  isLetterRevealed(letter: string): boolean {
    const normalized = letter
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return this.guessedLetters.has(normalized);
  }

  isLetterCorrect(letter: string): boolean {
    const normalized = letter
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return this.uniqueLetters.has(normalized);
  }

  isLetterWrong(letter: string): boolean {
    const normalized = letter
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return !this.guessedLetters.has(normalized);
  }

  guessLetter(letter: string): boolean {
    if (!this.canGuess) return false;

    const normalizedLetter = letter
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (this.guessedLetters.has(normalizedLetter)) return false;

    this.guessedLetters.add(normalizedLetter);

    if (this.isComplete && this.status === "playing") {
      this.status = "revealed";
    }

    return true;
  }

  reveal(): void {
    this.status = "revealed";
    for (const letter of this.uniqueLetters) {
      this.guessedLetters.add(letter);
    }
  }

  unreveal(): void {
    this.status = "playing";
    this.guessedLetters.clear();
  }

  markWon(): void {
    this.status = "won";
  }

  markLost(): void {
    this.status = "lost";
  }

  reset(): void {
    this.guessedLetters.clear();
    this.status = "pending";
  }

  serialize(): SerializedGame {
    return {
      id: this.id,
      texto: this.texto,
      guessedLetters: Array.from(this.guessedLetters),
      status: this.status,
    };
  }

  static deserialize(data: SerializedGame): Game {
    const game = new Game(data.texto, data.id);
    game.guessedLetters = new Set(data.guessedLetters);
    game.status = data.status;
    return game;
  }
}
