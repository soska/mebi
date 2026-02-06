import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ClockIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface GameTimerProps {
  game: Game;
}

export const GameTimer = observer(function GameTimer({ game }: GameTimerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial measurement
    const updateHeight = () => {
      const bounds = element.getBoundingClientRect();
      setHeight(bounds.height);
    };

    updateHeight();

    // Set up ResizeObserver for dynamic resizing
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (game.status !== "playing") {
    return null;
  }

  // Calculate the progress percentage (0 to 1)
  const progress = game.remainingTime / Game.TIMER_DURATION;
  // Calculate the scale for the bar (1 = full, 0 = empty)
  const barScale = progress;
  // Calculate the timer text position (0 = top, height = bottom)
  const timerYPosition = height * (1 - progress);

  return (
    <div className="absolute left-0 top-0 h-full w-2 z-4 bg-red-500" ref={ref}>
      <motion.div
        className="absolute h-full w-full bg-green-500 origin-bottom"
        animate={{ scaleY: barScale }}
        transition={{ type: "tween", duration: 1, ease: "linear" }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.div
        className="absolute -top-2 left-4"
        animate={{ y: timerYPosition }}
        transition={{ type: "tween", duration: 1, ease: "linear" }}
      >
        <motion.div
          className={cn(
            "flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 font-mono text-md",
            game.isTimerLow ? "text-red-400" : "text-white/80"
          )}
          animate={game.isTimerLow ? { scale: [1, 1.05, 1] } : {}}
          transition={{
            duration: 0.5,
            repeat: game.isTimerLow ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <ClockIcon className="w-5 h-5" />
          <span>{game.formattedTime}</span>
        </motion.div>
      </motion.div>
    </div>
  );
});
