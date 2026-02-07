import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../components/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-900 text-white/80">
      <h1 className="text-5xl font-bold mb-8">Mebi</h1>
      <Link to="/create">
        <Button size="lg" className="flex items-center gap-2">
          Crear Partida
          <ArrowRightIcon className="w-9 h-9" />
        </Button>
      </Link>
    </div>
  );
}
