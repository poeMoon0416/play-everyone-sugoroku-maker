import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import { Player } from "../utils/SugorokuUtils.ts";

interface RankingProps {
  players: Signal<Player[]>;
}

export default function Ranking({ players }: RankingProps) {
  return (
    <>
      <article>
        <ul class="flex flex-row justify-center gap-2">
          {players.value.toSorted((prev, next) => next.progress - prev.progress)
            .map((player, idx) => (
              <li class="p-4">
                {idx + 1}位
                <div
                  class={`md:w-6 aspect-square rounded-full ${player.bgColor}`}
                />
              </li>
            ))}
        </ul>
      </article>
    </>
  );
}
