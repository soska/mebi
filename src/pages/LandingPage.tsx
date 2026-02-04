import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../components/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-900 text-white/80">
      <h1 className="text-5xl font-bold mb-8">Mebi</h1>
      <p className="text-xl max-w-md text-center mb-6">
        Un juego estilo ahorcado para adivinar versículos de la Biblia.
      </p>
      <ol className="list-decimal text-lg max-w-md mb-8 space-y-2 pl-6">
        <li>Escribe uno o más versículos, cada uno en su propia línea.</li>
        <li>Se creará una partida por cada versículo.</li>
        <li>Adivina las letras antes de quedarte sin intentos.</li>
      </ol>
      <Link to="/create">
        <Button size="lg" className="flex items-center gap-2">
          Comenzar
          <ArrowRightIcon className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
