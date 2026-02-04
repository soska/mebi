import { useState } from "react";
import { useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useGameStore } from "../stores/RootStore";
import { Button } from "../components/ui/Button";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "../lib/utils";

export const CreatePage = observer(function CreatePage() {
  const [texto, setTexto] = useState("");
  const [, setLocation] = useLocation();
  const gameStore = useGameStore();


  const buttonDisabled = !texto.trim();

  const handleCreate = () => {
    const textos = texto.split("\n").filter((t) => t.trim());
    if (textos.length === 0) return;

    const firstGameId = gameStore.createGames(textos);
    if (firstGameId) {
      setLocation(`/play/${firstGameId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-900">
      <h1 className="text-3xl font-bold mb-6 text-white/80">Crear una partida</h1>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe cada versículo en una línea..."
        className="w-full max-w-2xl h-96 max-h-[80vh] p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-grandstander text-2xl"
      />

      <Button onClick={handleCreate} size="lg" className={cn("mt-4 flex items-center justify-center gap-2", buttonDisabled ? "cursor-not-allowed" : "")} disabled={buttonDisabled}>
        Crear partida
        <ArrowRightIcon className="w-10 h-10" />
      </Button>
    </div>
  );
});
