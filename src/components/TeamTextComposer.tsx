import { observer } from "mobx-react-lite";
import { cn } from "../lib/utils";
import { motion } from "motion/react";


interface TeamTextComposerProps {
  placeholder: string;
  text: string;
  setText: (text: string) => void;
}

type LengthScore = "good" | "medium" | "bad" | "terrible";

export const TeamTextComposer = observer(function TeamTextComposer({
  text,
  setText,
  placeholder,
}: TeamTextComposerProps) {
  const charactersCount = text.length;
  const words = text.trim().split(/\s+/);
  const wordsCount = words.filter((word) => word.length > 0).length;
  const lengthScore: LengthScore =
    charactersCount > 150
      ? "terrible"
      : charactersCount > 120
        ? "bad"
        : charactersCount > 90
          ? "medium"
          : "good";
  return (
    <motion.div className="px-4"
      initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
    >
      <div className="bg-gray-100 flex flex-col rounded-md">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full h-52 max-h-[80vh] p-3 border rounded-lg resize-none bg-white rounded-tl-md rounded-tr-md text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-grandstander text-lg"
        />
        <div
          className={cn(
            "flex flex-row gap-2 p-2",
            lengthScore === "terrible" && "text-red-600 bg-red-50",
            lengthScore === "bad" && "text-red-500",
            lengthScore === "medium" && "text-yellow-500",
            lengthScore === "good" && "text-gray-600"
          )}
        >
          <div>{wordsCount} palabras</div>
          <div>{charactersCount} letras</div>
        </div>
      </div>
    </motion.div>
  );
});
