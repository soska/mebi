import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { BoardLetterSlot } from "../ui/BoardLetterSlot";
import { BoardSymbolSlot } from "../ui/BoardSymbolSlot";

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
    <div
      className="game-board flex flex-wrap justify-center gap-[var(--board-gap-word)]"
      style={{ '--board-scale': game.boardScale } as React.CSSProperties}
    >
      {game.words.map((word, wordIndex) => {
        // Filter to only letters for rendering
        const letters = word.split("")
        // const letters = word.split("").filter((letter) =>
        //   /[A-ZÁÉÍÓÚÜÑ0-9:]/i.test(letter)
        // );

        return (
          <div key={wordIndex} className="flex gap-[var(--board-gap-letter)]">
            {letters.map((letter, letterIndex) => {
              const isLetter = /[A-ZÁÉÍÓÚÜÑ0-9:]/i.test(letter);
              if (isLetter) {
                return (
                  <BoardLetterSlot
                    key={letterIndex}
                    letter={letter}

                    isRevealed={game.isLetterRevealed(letter) || game.status === "revealed" || game.gameOver}
                    state={getLetterState()}
                  />
                );
              } else {
                return (
                  <BoardSymbolSlot
                    key={letterIndex}
                    letter={letter}
                    isRevealed={game.status == "revealed" || game.gameOver}
                  />
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
});
