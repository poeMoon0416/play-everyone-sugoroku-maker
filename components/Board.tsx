import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import { Mode, Player } from "../utils/SugorokuUtils.ts";

interface BoardProps {
  board: Signal<string[][]>;
  players: Signal<Player[]>;
  selectedTool: Signal<string>;
  mode: Signal<Mode>;
  rolling: Signal<boolean>;
}

export default function Board(
  { board, players, selectedTool, mode, rolling }: BoardProps,
) {
  function handleCellClick(
    { rowNum, colNum }: { rowNum: number; colNum: number },
  ) {
    // 元のスタートの削除とプレイヤーの移動
    if (selectedTool.value === "スタート") {
      board.value = board.value.map((r) =>
        Array.from(r, (c) => c === "スタート" ? "" : c)
      );
      for (const player of players.value) {
        player.row = rowNum;
        player.col = colNum;
      }
    }
    // 元のゴールの削除
    if (selectedTool.value === "ゴール") {
      board.value = board.value.map((r) =>
        Array.from(r, (c) => c === "ゴール" ? "" : c)
      );
    }
    // 盤面の更新
    board.value = board.value.map((r, rn) =>
      Array.from(
        r,
        (c, cn) => rn === rowNum && cn === colNum ? selectedTool.value : c,
      )
    );
  }
  // console.log(players.value);

  return (
    <article class="h-4/6 md:h-5/6 aspect-square md:aspect-auto text-[.65rem] md:text-base  relative grid grid-cols-8 border-4 border-slate-700">
      {board.value.map((row, rowNum) =>
        row.map((cell, colNum) => (
          <button
            class={`aspect-square relative border-2 ${
              mode.value === "playing"
                ? "cursor-default"
                : "hover:border-secondary hover:border-dotted"
            } ${cell ? "border-secondary bg-slate-200" : "border-slate-200"}`}
            onClick={mode.value === "playing"
              ? () => {}
              : (_event) => handleCellClick({ rowNum, colNum })}
          >
            {cell && cell !== "ノーマル" && cell}
            {players.value.filter((player) =>
              player.row === rowNum && player.col === colNum
            ).map((player) => (
              <div
                class={`w-3 md:w-6  absolute ${player.position} aspect-square rounded-full ${player.bgColor}`}
              />
            ))}
          </button>
        ))
      )}
      {mode.value === "playing" && [
        "left-0 md:-left-32 -top-16 md:top-0",
        "right-0 md:-right-32 -top-16 md:top-0",
        "left-0 md:-left-32 -bottom-16 md:bottom-0",
        "right-0 md:-right-32 -bottom-16 md:bottom-0",
      ].slice(0, players.value.length).map((pos, idx) => (
        <img
          src={rolling.value && players.value[idx].isCurrent
            ? "/rolling-dice.gif"
            : `/dice-${players.value[idx].dice}.png`}
          alt="プレイヤーのサイコロ"
          width="15%"
          class={`z-10 absolute aspect-square object-contain ${pos}`}
        />
      ))}
    </article>
  );
}
