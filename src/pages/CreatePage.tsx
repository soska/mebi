import { useMemo } from "react";
import { useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useGameStore } from "../stores/RootStore";
import { Button } from "../components/ui/Button";
import { TeamTextComposer } from "../components/TeamTextComposer";
import { ArrowRightIcon, MessageCircleWarningIcon, MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { observable, action, makeObservable, computed } from "mobx";


class CreatePageStore {
  teamsCount: number = 3;
  texts: string[] = [];

  setText(text: string, index: number): void {
    this.texts[index] = text;
  }

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
      fairnessScore: computed,
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

  get fairnessScore(): number {
    const lengths = this.textsForTeams.map((text) => text.length).sort((a, b) => a - b);
    const max = lengths[lengths.length - 1];
    const min = lengths[0];
    const delta = max - min;


    if (delta === 0) return 1;
    if (delta === max) return 0;

    // try to avoid division by zero
    if (max === 0) return 1;

    // avoid overreacting to small differences
    if (delta < 10) return 1;


    return 1 - (delta / max);
  }
}

const CounterButton = ({ onClick, children, className }: { onClick: () => void, children: React.ReactNode, className?: string }) => {
  return (
    <button onClick={onClick} className={cn("bg-black/50 text-white/80 p-2 w-12 flex items-center justify-center", className)}>{children}</button>
  );
};

const FairnessNotice = observer(({ score, canSubmit }: { score: number, canSubmit: boolean }) => {
  if (isNaN(score)) return null;

  if (!canSubmit) {
    return null;
  }

  if (score < 0.49) {
    return (
      <div className="text-red-500 text-lg font-grandstander flex items-center justify-center gap-2">
        <MessageCircleWarningIcon />
        <span>
          Puede que La diferencia de longitud sea muy grande
        </span>
      </div>

    )
  }

  if (score < 0.65) {
    return (
      <div className="text-yellow-500 text-lg font-grandstander flex items-center justify-center gap-2">
        <MessageCircleWarningIcon />
        <span>
          Checa que la longitud de los textos sea similar
        </span>
      </div>

    )
  }

  return (
    null
  );
});

export const CreatePage = observer(function CreatePage() {
  const store = useMemo(() => new CreatePageStore(), []);
  const [, setLocation] = useLocation();
  const gameStore = useGameStore();

  const buttonDisabled = !store.canSubmit;

  const handleCreate = () => {
    const texts = store.textsForTeams;
    if (texts.length === 0) return;

    const firstGameId = gameStore.createGames(texts);
    if (firstGameId) {
      setLocation(`/play/${firstGameId}`);
    }
  };

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
            <input value={store.teamsCount} readOnly className="bg-purple-100 text-purple-900 text-2xl font-bold p-2 w-12 text-center font-grandstander" />
            <CounterButton onClick={() => store.increaseTeamsCount()} className="rounded-tr-md rounded-br-md">
              <PlusIcon className="w-8 h-8 stroke-5" />
            </CounterButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        {Array.from({ length: store.teamsCount }, (_, index) => (
          <TeamTextComposer
            key={index}
            text={store.texts[index]}
            setText={(text) => store.setText(text, index)}
            placeholder={`Texto del equipo ${index + 1}`}
          />
        ))}
      </div>

      <div className="sticky bottom-0 left-0 right-0 mt-4 bg-blue-900 border-t-2 border-white/20   justify-between items-center flex p-4">
        <div>
          <FairnessNotice score={store.fairnessScore} canSubmit={store.canSubmit} />
        </div>
        <Button onClick={handleCreate} size="lg" className={cn("flex items-center justify-center gap-2", buttonDisabled ? "cursor-not-allowed" : "")} disabled={buttonDisabled}>
          Crear partida
          <ArrowRightIcon className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
});
