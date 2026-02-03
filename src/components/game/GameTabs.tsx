import { observer } from "mobx-react-lite";
import { useGameStore } from "../../stores/RootStore";
import { TabItem } from "../ui/TabItem";

export const GameTabs = observer(function GameTabs() {
  const gameStore = useGameStore();

  const getTabState = (index: number) => {
    const game = gameStore.getGameByIndex(index);
    if (!game) return "inactive";

    if (game.id === gameStore.activeGameId) return "active";
    if (game.status === "won") return "completed";
    if (game.status === "lost") return "failed";
    return "inactive";
  };

  return (
    <div className="flex flex-col justify-center gap-2 flex-wrap">
      {gameStore.gamesList.map((_, index) => (
        <TabItem
          key={index}
          index={index}
          state={getTabState(index)}
          onClick={() => gameStore.setActiveGameByIndex(index)}
        />
      ))}
    </div>
  );
});
