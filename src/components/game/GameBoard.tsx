import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { BoardLetterSlot } from "../ui/BoardLetterSlot";

interface GameBoardProps {
  game: Game;
}

export const GameBoard = observer(function GameBoard({ game }: GameBoardProps) {
  const getLetterState = () => {
    if (game.status === "won") return "correct";
    if (game.status === "lost") return "wrong";
    return "revealed";
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {game.words.map((word, wordIndex) => (
        <div key={wordIndex} className="flex gap-2">
          {word.split("").map((letter, letterIndex) => {
            const isLetter = /[A-ZÁÉÍÓÚÜÑ]/i.test(letter);

            if (!isLetter) {
              return (
                <div
                  key={letterIndex}
                  className="w-6 flex items-center justify-center text-xl"
                >
                  {letter}
                </div>
              );
            }

            return (
              <BoardLetterSlot
                key={letterIndex}
                letter={letter}
                isRevealed={game.isLetterRevealed(letter)}
                state={getLetterState()}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});
