import { useParams, useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useGameStore } from "../stores/RootStore";
// import { Game } from "../stores/Game";
import { GameBoard } from "../components/game/GameBoard";
import { VirtualKeyboard } from "../components/game/VirtualKeyboard";
import { GameTabs } from "../components/game/GameTabs";
import { GameControls } from "../components/game/GameControls";
import { Button } from "../components/ui/Button";

export const PlayPage = observer(function PlayPage() {
  const params = useParams<{ gameId: string }>();
  const [, setLocation] = useLocation();
  const gameStore = useGameStore();

  useEffect(() => {
    if (params.gameId && gameStore.activeGameId !== params.gameId) {
      gameStore.setActiveGame(params.gameId);
    }
  }, [params.gameId, gameStore]);

  const game = gameStore.activeGame;

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">No hay juegos</p>
        <Button onClick={() => setLocation("/create")}>Crear Juegos</Button>
      </div>
    );
  }

  const handleGuess = (letter: string) => {
    game.guessLetter(letter);
  };

  const handleReset = () => {
    gameStore.resetAllGames();
  };

  const handleClear = () => {
    gameStore.clearAllGames();
    setLocation("/create");
  };

  if (game.status === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center p-4 gap-6 bg-blue-900">
        <GameTabs />

        <div className="flex-1 flex items-center justify-center">
          <Button size="lg" onClick={() => game.start()}>
            Comenzar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex-col items-center  bg-blue-900 grid grid-cols-1  grid-rows-[1fr_auto]">

      <div className="grid grid-cols-[auto_1fr] h-full">
        <div className="bg-black/20 p-4">
          <GameTabs />
        </div>
        <div className="grid grid-rows-[1fr_auto]">
          <div className="p-4 flex items-center justify-center">
            <GameBoard game={game} />
          </div>
          <div className="p-4 flex items-center justify-center">
            <GameControls game={game} />
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center bg-black/50 p-4">

        {game.status === "playing" && (
          <VirtualKeyboard game={game} onGuess={handleGuess} />
        )}

        {gameStore.allGamesCompleted && (
          <div className="flex gap-4 mt-4">
            <Button onClick={handleReset} variant="primary">
              Reiniciar Todo
            </Button>
            <Button onClick={handleClear} variant="ghost">
              Borrar Todo
            </Button>
          </div>
        )}
      </div>

    </div>
  );
});
