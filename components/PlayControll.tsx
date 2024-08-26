import { Mode, Player } from "../utils/SugorokuUtils.ts";
import { Signal } from "@preact/signals";

interface PlayControllProps {
  board: Signal<string[][]>;
  players: Signal<Player[]>;
  mode: Signal<Mode>;
  rolling: Signal<boolean>;
  finished: Signal<boolean>;
}

export default function PlayControll(
  { board, players, mode, rolling, finished }: PlayControllProps,
) {
  const PLAYER_BG_COLORS = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
  ];
  const PLAYER_POSITIONS = [
    "top-0 left-0",
    "top-0 right-0",
    "bottom-0 right-0",
    "bottom-0 left-0",
  ];

  function handleRolling() {
    if (rolling.value && players.value[0].row !== -1) {
      const currentPlayerIdx = players.value.findIndex((player) =>
        player.isCurrent
      );
      players.value[currentPlayerIdx].dice = Math.floor(Math.random() * 6) + 1;
      // プレイヤーの位置を更新
      let { dice, row, col, prevDirec } = players.value[currentPlayerIdx];
      for (let _ = 0; _ < dice; _++) {
        if (row - 1 >= 0 && board.value[row - 1][col] && prevDirec !== "v") {
          row--;
          prevDirec = "^";
        } else if (
          col + 1 < board.value[0].length && board.value[row][col + 1] &&
          prevDirec !== "<"
        ) {
          col++;
          prevDirec = ">";
        } else if (
          row + 1 < board.value.length && board.value[row + 1][col] &&
          prevDirec !== "^"
        ) {
          row++;
          prevDirec = "v";
        } else if (
          col - 1 >= 0 && board.value[row][col - 1] && prevDirec !== ">"
        ) {
          col--;
          prevDirec = "<";
        }
      }
      // 最初に止まったマスの効果
      let oneMore = false;
      if (board.value[row][col] === "1すすむ") {
        players.value[currentPlayerIdx].progress += 1;
        if (row - 1 >= 0 && board.value[row - 1][col] && prevDirec !== "v") {
          row--;
          prevDirec = "^";
        } else if (
          col + 1 < board.value[0].length && board.value[row][col + 1] &&
          prevDirec !== "<"
        ) {
          col++;
          prevDirec = ">";
        } else if (
          row + 1 < board.value.length && board.value[row + 1][col] &&
          prevDirec !== "^"
        ) {
          row++;
          prevDirec = "v";
        } else if (
          col - 1 >= 0 && board.value[row][col - 1] && prevDirec !== ">"
        ) {
          col--;
          prevDirec = "<";
        }
      } else if (board.value[row][col] === "もう1回") {
        oneMore = true;
      }
      // プレイヤーの位置を反映
      players.value[currentPlayerIdx].row = row;
      players.value[currentPlayerIdx].col = col;
      players.value[currentPlayerIdx].prevDirec = prevDirec;
      players.value[currentPlayerIdx].progress += dice;
      // console.log(players.value);
      // ゴールしたとき
      const goal = { row: -1, col: -1 };
      for (let rowNum = 0; rowNum < board.value.length; rowNum++) {
        if (board.value[rowNum].includes("ゴール")) {
          goal.row = rowNum;
          goal.col = board.value[rowNum].indexOf("ゴール");
        }
      }
      if (row === goal.row && col === goal.col) {
        finished.value = true;
      }
      // 手番の更新
      if (!oneMore) {
        players.value[currentPlayerIdx].isCurrent = false;
        const nextPlayerIdx = (currentPlayerIdx + 1) % players.value.length;
        players.value[nextPlayerIdx].isCurrent = true;
      }
    }
    rolling.value = !rolling.value;
  }
  // console.log(players.value.length);

  return (
    <section class="text-lg md:text-2xl gap-8 md:gap-24  flex flex-row justify-center">
      <button
        name="pl-1"
        value="pl-1"
        class={`${
          players.value.length === 1 ? "pointer-events-none" : ""
        } relative top-12 md:static text-primary bg-secondary rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition`}
        onClick={() => {
          players.value = players.value.slice(0, players.value.length - 1);
        }}
      >
        -1
      </button>
      <button
        name="make"
        value="make"
        class="text-primary bg-secondary aspect-square rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition"
        onClick={() => mode.value = "making"}
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
        onClick={() => {
          players.value = [
            ...players.value,
            {
              row: players.value[0].row,
              col: players.value[0].col,
              dice: 1,
              isCurrent: false,
              prevDirec: "",
              bgColor: PLAYER_BG_COLORS[players.value.length],
              position: PLAYER_POSITIONS[players.value.length],
              progress: 0,
            },
          ];
        }}
      >
        +1
      </button>
    </section>
  );
}
