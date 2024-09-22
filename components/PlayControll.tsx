import { Mode, Player } from "../utils/SugorokuUtils.ts";
import { Signal } from "@preact/signals";

interface PlayControllProps {
  players: Signal<Player[]>;
  mode: Signal<Mode>;
  rolling: Signal<boolean>;
  handlePlayerIncrement: () => void;
  handleModeChange: () => void;
  handlePlayerDecrement: () => void;
  handleRolling: () => void;
}

export default function PlayControll(
  {
    players,
    rolling,
    handlePlayerDecrement,
    handleModeChange,
    handleRolling,
    handlePlayerIncrement,
  }: PlayControllProps,
) {
  // console.log(players.value.length);

  return (
    <section class="text-lg md:text-2xl gap-8 md:gap-24  flex flex-row justify-center">
      <button
        name="pl-1"
        value="pl-1"
        class={`${
          players.value.length === 1 ? "pointer-events-none" : ""
        } relative top-12 md:static text-primary bg-secondary rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition`}
        onClick={handlePlayerDecrement}
      >
        -1
      </button>
      <button
        name="make"
        value="make"
        class="text-primary bg-secondary aspect-square rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition"
        onClick={handleModeChange}
      >
        つくる！
      </button>
      <button
        name="roll"
        value="roll"
        class="text-primary bg-secondary aspect-square rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition"
        onClick={handleRolling}
      >
        {rolling.value ? "とめる！" : "ロール！"}
      </button>
      <button
        name="pl+1"
        value="pl+1"
        class={`${
          players.value.length === 4 ? "pointer-events-none" : ""
        } relative top-12 md:static text-primary bg-secondary rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition`}
        onClick={handlePlayerIncrement}
      >
        +1
      </button>
    </section>
  );
}
