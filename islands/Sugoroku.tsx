import { Signal, useSignal } from "@preact/signals";
import { Mode, Player, Tool } from "../utils/SugorokuUtils.ts";
import Board from "../components/Board.tsx";
import ToolBar from "../components/ToolBar.tsx";
import MakeControll from "../components/MakeControll.tsx";
import PlayControll from "../components/PlayControll.tsx";
import Ranking from "../components/Ranking.tsx";

export default function Sugoroku() {
  const board: Signal<string[][]> = useSignal(Array(8).fill(Array(8).fill("")));
  const players: Signal<Player[]> = useSignal([{
    row: -1,
    col: -1,
    dice: 1,
    isCurrent: true,
    bgColor: "bg-red-500",
    position: "top-0 left-0",
    prevDirec: "",
    progress: 0,
  }]);
  const selectedTool: Signal<Tool> = useSignal("ノーマル");
  const mode: Signal<Mode> = useSignal("making");
  const rolling: Signal<boolean> = useSignal(false);
  const finished: Signal<boolean> = useSignal(false);

  return (
    <>
      <Board
        board={board}
        players={players}
        selectedTool={selectedTool}
        mode={mode}
        rolling={rolling}
      />
      {finished.value
        ? <Ranking players={players} />
        : (mode.value === "playing"
          ? (
            <PlayControll
              board={board}
              players={players}
              mode={mode}
              rolling={rolling}
              finished={finished}
            />
          )
          : (
            <>
              <ToolBar selectedTool={selectedTool} />
              <MakeControll mode={mode} />
            </>
          ))}
    </>
  );
}
