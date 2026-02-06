import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";

interface GameTimerProps {
  game: Game;
}

export const GameTimer = observer(function GameTimer({ game }: GameTimerProps) {
  if (game.status !== "playing") {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 font-mono text-lg ${
        game.isTimerLow ? "text-red-400 animate-pulse" : "text-white/80"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
          clipRule="evenodd"
        />
      </svg>
      <span>{game.formattedTime}</span>
    </div>
  );
});
