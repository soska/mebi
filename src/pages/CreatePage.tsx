import { useState } from "react";
import { useLocation } from "wouter";
import { observer } from "mobx-react-lite";
import { useGameStore } from "../stores/RootStore";
import { Button } from "../components/ui/Button";

export const CreatePage = observer(function CreatePage() {
  const [texto, setTexto] = useState("");
  const [, setLocation] = useLocation();
  const gameStore = useGameStore();

  const handleCreate = () => {
    const textos = texto.split("\n").filter((t) => t.trim());
    if (textos.length === 0) return;

    const firstGameId = gameStore.createGames(textos);
    if (firstGameId) {
      setLocation(`/play/${firstGameId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Crear Juegos</h1>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe cada versículo en una línea..."
        className="w-full max-w-md h-48 p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button onClick={handleCreate} className="mt-4" disabled={!texto.trim()}>
        Crear
      </Button>
    </div>
  );
});
