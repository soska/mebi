import { useMemo } from "react";
import { useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useGameStore } from "../stores/RootStore";
import { Button } from "../components/ui/Button";
import { ArrowRightIcon, MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { observable, action, makeObservable, computed } from "mobx";

class CreatePageStore {
  teamsCount: number = 3;
  texts: string[] = [];

  setText: (text: string, index: number) => void = (text: string, index: number) => {
    console.log("setText", text, index);
    this.texts[index] = text;
  };

  constructor() {
    this.texts = Array.from({ length: this.teamsCount }, () => "");
    makeObservable(this, {
      teamsCount: observable,
      texts: observable,
      increaseTeamsCount: action,
      decreaseTeamsCount: action,
      setText: action,
      textsForTeams: computed,
      canSubmit: computed,
    });


  }

  public increaseTeamsCount() {
    this.teamsCount += 1;
    // Ensure texts array has enough elements
    if (this.texts.length < this.teamsCount) {
      this.texts = [...this.texts, ...Array.from({ length: this.teamsCount - this.texts.length }, () => "")];
    }
  }

  public decreaseTeamsCount() {
    if (this.teamsCount > 1) {
      this.teamsCount -= 1;
    }
  }

  get textsForTeams(): string[] {
    return this.texts.slice(0, this.teamsCount);
  }

  get canSubmit(): boolean {
    return this.textsForTeams.every((text) => text.trim());
  }
}

const CounterButton = ({ onClick, children, className }: { onClick: () => void, children: React.ReactNode, className?: string }) => {
  return (
    <button onClick={onClick} className={cn("bg-black/50 text-white/80 p-2 w-12 flex items-center justify-center", className)}>{children}</button>
  );
};


export const CreatePage = observer(function CreatePage() {
  const store = useMemo(() => new CreatePageStore(), []);
  (window as any).store = store;
  const [, setLocation] = useLocation();
  const gameStore = useGameStore();

  const buttonDisabled = !store.canSubmit;


  const handleCreate = () => {
    const texts = store.textsForTeams
    if (texts.length === 0) return;

    const firstGameId = gameStore.createGames(texts);
    if (firstGameId) {
      setLocation(`/play/${firstGameId}`);
    }
  };

  { console.log(store.canSubmit) }

  return (
    <div className="min-h-screen flex flex-col bg-blue-900">
      <div className="bg-purple-600 flex flex-row items-center justify-between sticky top-0">
        <h1 className="text-lg font-bold text-white p-4">Crear una partida</h1>
        <div className="flex flex-row items-center gap-2">
          <div className="text-white/80 text-lg font-grandstander">
            # de equipos
          </div>
          <div className="flex flex-row">
            <CounterButton onClick={() => store.decreaseTeamsCount()} className="rounded-tl-md rounded-bl-md">
              <MinusIcon className="w-8 h-8 stroke-5" />
            </CounterButton>
            <input value={store.teamsCount} className="bg-purple-100 text-purple-900 text-2xl font-bold p-2 w-12 text-center font-grandstander" />
            <CounterButton onClick={() => store.increaseTeamsCount()} className="rounded-tr-md rounded-br-md">
              <PlusIcon className="w-8 h-8 stroke-5" />
            </CounterButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        {Array.from({ length: store.teamsCount }, (_, index) => (
          <div key={index} className="px-4">
            <textarea
              value={store.texts[index]}
              onChange={(e) => store.setText(e.target.value, index)}
              placeholder={`Texto del equipo ${index + 1}`}
              className="w-full h-52 max-h-[80vh] p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-grandstander text-lg"
            />
          </div>
        ))}
      </div>
      {/* <textarea
        value={store.texto}
        onChange={(e) => store.setTexto(e.target.value)}
        placeholder="Escribe cada versículo en una línea..."
        className="w-full max-w-2xl h-96 max-h-[80vh] p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-grandstander text-2xl"
      /> */}

      <div className="sticky bottom-0 left-0 right-0 bg-blue-950 justify-end flex p-4">
        <Button onClick={handleCreate} size="lg" className={cn("flex items-center justify-center gap-2", buttonDisabled ? "cursor-not-allowed" : "")} disabled={buttonDisabled}>
          Crear partida
          <ArrowRightIcon className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
});
