import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { Button } from "../ui/Button";

interface GameControlsProps {
  game: Game;
}

export const GameControls = observer(function GameControls({
  game,
}: GameControlsProps) {
  if (game.status === "playing") {
    return (
      <div className="flex justify-center">
        <Button variant="ghost" size="lg" onClick={() => game.reveal()}>
          Revelar
        </Button>
      </div>
    );
  }

  if (game.status === "revealed") {
    return (
      <div className="flex justify-center gap-4">
        <Button variant="success" size="lg" onClick={() => game.markWon()}>
          Correcto
        </Button>
        <Button variant="danger" size="lg" onClick={() => game.markLost()}>
          Incorrecto
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <span
        className={
          game.status === "won"
            ? "text-green-500 text-xl font-bold"
            : "text-red-500 text-xl font-bold"
        }
      >
        {game.status === "won" ? "✓ Correcto" : "✗ Incorrecto"}
      </span>
    </div>
  );
});
