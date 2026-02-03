import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { KeyboardKey } from "../ui/KeyboardKey";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

interface VirtualKeyboardProps {
  game: Game;
  onGuess: (letter: string) => void;
}

export const VirtualKeyboard = observer(function VirtualKeyboard({
  game,
  onGuess,
}: VirtualKeyboardProps) {
  const getKeyState = (letter: string): "available" | "correct" | "wrong" => {
    if (!game.guessedLetters.has(letter)) {
      return "available";
    }
    const isCorrect = game.isLetterCorrect(letter);
    if (isCorrect) {
      return "correct";
    }
    return "wrong";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((letter) => (
            <KeyboardKey
              key={letter}
              letter={letter}
              state={getKeyState(letter)}
              disabled={!game.canGuess}
              onClick={() => onGuess(letter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
});
