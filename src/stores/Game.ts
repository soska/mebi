import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

export type GameStatus = "pending" | "playing" | "revealed" | "won" | "lost";

export interface SerializedGame {
  id: string;
  texto: string;
  guessedLetters: string[];
  status: GameStatus;
  boardScale?: number;
  remainingTime?: number;
  timerStartedAt?: number;
}

export class Game {
  id: string;
  texto: string;
  guessedLetters: Set<string> = new Set();
  status: GameStatus = "pending";
  boardScale: number = 1;
  remainingTime: number = 60;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private timerStartedAt: number | null = null;

  static MAX_GUESSES = 4;
  static TIMER_DURATION = 60;

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

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  get isTimerLow(): boolean {
    return this.remainingTime <= 10;
  }

  start(): void {
    if (this.status === "pending") {
      this.status = "playing";
      this.startTimer();
    }
  }

  startTimer(): void {
    this.stopTimer();
    this.timerStartedAt = Date.now();
    this.timerInterval = setInterval(() => this.tick(), 1000);
    this.setupVisibilityHandler();
  }

  private tick(): void {
    if (this.remainingTime > 0) {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        this.handleTimeOut();
      }
    }
  }

  private handleTimeOut(): void {
    this.stopTimer();
    this.reveal();
    this.markLost();
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerStartedAt = null;
  }

  private setupVisibilityHandler(): void {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && this.timerStartedAt && this.status === "playing") {
        const elapsed = Math.floor((Date.now() - this.timerStartedAt) / 1000);
        const expectedRemaining = Game.TIMER_DURATION - elapsed;
        if (expectedRemaining <= 0) {
          this.remainingTime = 0;
          this.handleTimeOut();
        } else {
          this.remainingTime = Math.max(0, expectedRemaining);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
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
    this.stopTimer();
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
    this.stopTimer();
    this.status = "won";
  }

  markLost(): void {
    this.stopTimer();
    this.status = "lost";
  }

  setBoardScale(scale: number): void {
    this.boardScale = Math.round(Math.max(0.5, Math.min(1.5, scale)) * 10) / 10;
  }

  reset(): void {
    this.stopTimer();
    this.guessedLetters.clear();
    this.status = "pending";
    this.remainingTime = Game.TIMER_DURATION;
  }

  serialize(): SerializedGame {
    return {
      id: this.id,
      texto: this.texto,
      guessedLetters: Array.from(this.guessedLetters),
      status: this.status,
      boardScale: this.boardScale,
      remainingTime: this.remainingTime,
      timerStartedAt: this.timerStartedAt ?? undefined,
    };
  }

  static deserialize(data: SerializedGame): Game {
    const game = new Game(data.texto, data.id);
    game.guessedLetters = new Set(data.guessedLetters);
    game.status = data.status;
    game.boardScale = data.boardScale ?? 1;
    game.remainingTime = data.remainingTime ?? Game.TIMER_DURATION;

    // Resume timer if game was playing
    if (data.status === "playing" && data.timerStartedAt) {
      const elapsed = Math.floor((Date.now() - data.timerStartedAt) / 1000);
      const expectedRemaining = (data.remainingTime ?? Game.TIMER_DURATION) - elapsed;
      if (expectedRemaining <= 0) {
        game.remainingTime = 0;
        game.reveal();
        game.markLost();
      } else {
        game.remainingTime = expectedRemaining;
        game.startTimer();
      }
    }

    return game;
  }
}
