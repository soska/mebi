import { useParams, useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useGameStore } from "../stores/RootStore";
// import { Game } from "../stores/Game";
import { GameBoard } from "../components/game/GameBoard";
import { VirtualKeyboard } from "../components/game/VirtualKeyboard";
import { GameTabs } from "../components/game/GameTabs";
import { GameControls } from "../components/game/GameControls";
import { GameTimer } from "../components/game/GameTimer";
import { Button } from "../components/ui/Button";
import { AnimatePresence, motion } from "motion/react";

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

  return (
    <div className="grid grid-cols-[auto_1fr] h-full bg-blue-900">
      <div className="bg-black/20 p-4">
        <GameTabs />
      </div>

      <div className="min-h-screen  flex-col items-center  bg-blue-900 grid grid-cols-1  grid-rows-[1fr_auto]">
        <AnimatePresence mode="wait">
          {game.status === "pending" ? (
            <motion.div
              key="pending"
              className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0.8, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0.8, scale: 1.3, filter: "blur(10px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button size="lg" onClick={() => game.start()}>
                Comenzar
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="game-board"
                className="grid grid-rows-[1fr_auto] h-full"
                initial={{ opacity: 0.8, scale: 0.97, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0.8, scale: 1.3, filter: "blur(10px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="p-4 flex items-center justify-center relative">
                  <GameBoard game={game} />
                  <div className="absolute top-2 left-2">
                    <GameTimer game={game} />
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/30 rounded-lg p-1">
                    <button
                      onClick={() => game.setBoardScale(game.boardScale - 0.1)}
                      disabled={game.boardScale <= 0.5}
                      className="w-8 h-8 flex items-center justify-center rounded text-white/70 hover:bg-white/10 disabled:opacity-30 font-bold text-lg"
                    >
                      -
                    </button>
                    <span className="text-white/60 text-sm w-10 text-center font-mono">
                      {Math.round(game.boardScale * 100)}%
                    </span>
                    <button
                      onClick={() => game.setBoardScale(game.boardScale + 0.1)}
                      disabled={game.boardScale >= 1.5}
                      className="w-8 h-8 flex items-center justify-center rounded text-white/70 hover:bg-white/10 disabled:opacity-30 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <GameControls game={game} />
                </div>
              </motion.div>

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
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
