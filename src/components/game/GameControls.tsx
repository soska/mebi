import * as React from "react";
import { observer } from "mobx-react-lite";
import { Game } from "../../stores/Game";
import { Button } from "../ui/Button";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils";

interface GameControlsProps {
  game: Game;
}

interface AnimatedWrapperProps {
  children: React.ReactNode;
  key: string;
}

const AnimatedWrapper = ({ children, key }: AnimatedWrapperProps) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      transition={{ duration: 0.13, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};



export const GameControls = observer(function GameControls({
  game,
}: GameControlsProps) {

  // (window as any).game = game;


  const [confirming, setConfirming] = React.useState<boolean>(false);

  const playing = game.status === "playing";
  const revealed = game.status === "revealed";


  if (game.gameOver) {
    return (
      <AnimatePresence mode="wait">
        <motion.div className={cn("flex w-full justify-center items-center p-4", {
          "bg-green-500": game.status === "won",
          "bg-red-500": game.status === "lost",
        })}
          initial={{ opacity: 0, y: '25%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '25%' }}
          transition={{ duration: 0.20, ease: "easeOut" }}
        >
          <span className={cn("text-3xl font-bold", {
            "text-white": game.status === "won",
            "text-yellow-500": game.status === "lost",
          })}>
            {game.status === "won" ? "¡La respuesta es correcta!" : "¡La respuesta es incorrecta!"}
          </span>
        </motion.div>
      </AnimatePresence>
    );
  }


  return (
    <div className="flex justify-center gap-4 p-4" >
      <AnimatePresence mode="wait">
        {playing && confirming && (
          <AnimatedWrapper key="confirming">
            <div className="flex justify-center gap-4">

              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                <span className="flex items-center justify-center gap-2">
                  <XIcon className="w-8 h-8 -mt-2 text-orange-300/80" />
                  <span className="uppercase">
                    Cancelar
                  </span>
                </span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => game.reveal()}>
                <span className="flex items-center justify-center gap-2">
                  <SearchIcon className="w-8 h-8 -mt-2 text-orange-300/80" />
                  <span className="uppercase">
                    Si, revelar
                  </span>
                </span>
              </Button>
            </div>
          </AnimatedWrapper>
        )}
        {playing && !confirming && (
          <AnimatedWrapper key="initial">
            <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
              <span className="flex items-center justify-center gap-2">
                <SearchIcon className="w-8 h-8 -mt-2 text-orange-300/80" />
                <span className="uppercase">
                  Revelar
                </span>
              </span>
            </Button>
          </AnimatedWrapper>
        )}
        {revealed && (
          <AnimatedWrapper key="revealed">
            <div className="flex justify-center gap-12">
              <Button variant="danger" size="md" onClick={() => game.markLost()}>
                <span className="flex items-center justify-center gap-2">
                  <XIcon className="w-8 h-8 -mt-2 text-orange-300/80" />
                  <span className="uppercase">
                    Incorrecto
                  </span>
                </span>
              </Button>

              <Button variant="success" size="md" onClick={() => game.markWon()}>
                <span className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-8 h-8 -mt-2 text-orange-300/80" />
                  <span className="uppercase">
                    Correcto
                  </span>
                </span>
              </Button>
            </div>
          </AnimatedWrapper>
        )}

      </AnimatePresence>

    </div >
  );


});
