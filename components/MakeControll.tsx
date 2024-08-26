import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import { Mode } from "../utils/SugorokuUtils.ts";

interface MakeControllProps {
  mode: Signal<Mode>;
}

export default function MakeControll({ mode }: MakeControllProps) {
  return (
    <button
      name="play"
      value="play"
      class="whitespace-nowrap text-primary bg-secondary aspect-square rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition"
      onClick={() => mode.value = "playing"}
    >
      あそぶ！
    </button>
  );
}
