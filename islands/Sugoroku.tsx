import { Signal, useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Mode, Player, Tool } from "../utils/SugorokuUtils.ts";
import { WsMsg } from "../utils/WsUtils.ts";
import Board from "../components/Board.tsx";
import ToolBar from "../components/ToolBar.tsx";
import MakeControll from "../components/MakeControll.tsx";
import PlayControll from "../components/PlayControll.tsx";
import Ranking from "../components/Ranking.tsx";

interface SugorokuProps {
  url: string;
}

export default function Sugoroku({ url }: SugorokuProps) {
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

  // WebSocketClient
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const roomId = (new URL(url)).pathname.split("/").pop();
    // 安全性の関係でデプロイ環境だとwssじゃないと動かないようになっているっぽい。
    // ローカルだとhttp/httpsの関係で逆なので注意！
    const ws = new WebSocket(`wss://${(new URL(url)).host}/ws/${roomId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg: WsMsg = JSON.parse(event.data);
      switch (msg.name) {
        case "updateBoard":
          console.log("ok");
          board.value = msg.board;
          break;
        case "updatePlayers":
          players.value = msg.players;
          break;
        case "updateSelectedTool":
          selectedTool.value = msg.selectedTool;
          break;
        case "updateMode":
          mode.value = msg.mode;
          break;
        case "updateRolling":
          rolling.value = msg.rolling;
          break;
        case "updateFinished":
          finished.value = msg.finished;
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => ws.close();
  }, []);

  function sendMsg(msg: WsMsg) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.error("WebSocket is not open");
    }
  }

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
    // WebSocketで盤面とプレイヤー位置の同期
    sendMsg({ name: "updateBoard", board: board.value });
    sendMsg({ name: "updatePlayers", players: players.value });
  }

  function handleBoardTouchMove(
    event: TouchEvent,
  ) {
    if (mode.value !== "playing") {
      // スクロールを防ぐ
      event.preventDefault();
      // 0本目の指のタッチ
      const touch = event.touches[0];
      // z-indexで最上部にある要素を指の位置から取得する
      const touchedCell = document.elementFromPoint(touch.pageX, touch.pageY);
      // 範囲外をreturnする
      if (
        touchedCell === null ||
        getComputedStyle(touchedCell).getPropertyValue("--row-num") === "" ||
        getComputedStyle(touchedCell).getPropertyValue("--col-num") === ""
      ) {
        return;
      }
      const rowNum = Number(
        getComputedStyle(touchedCell).getPropertyValue("--row-num"),
      );
      const colNum = Number(
        getComputedStyle(touchedCell).getPropertyValue("--col-num"),
      );
      handleCellClick({ rowNum, colNum });
    }
  }

  function handleBoardPointerDown(event: PointerEvent) {
    if (mode.value !== "playing") {
      // console.log("pointerDown");
      const targetCell = event.target as HTMLElement;
      const rowNum = Number(
        getComputedStyle(targetCell).getPropertyValue("--row-num"),
      );
      const colNum = Number(
        getComputedStyle(targetCell).getPropertyValue("--col-num"),
      );
      handleCellClick({ rowNum, colNum });
    }
  }

  function handleBoardPointerOver(event: PointerEvent) {
    if (mode.value !== "playing" && event.buttons % 2 === 1) {
      // console.log("pointerOver");
      const targetCell = event.target as HTMLElement;
      const rowNum = Number(
        getComputedStyle(targetCell).getPropertyValue("--row-num"),
      );
      const colNum = Number(
        getComputedStyle(targetCell).getPropertyValue("--col-num"),
      );
      handleCellClick({ rowNum, colNum });
    }
  }

  function handlePlayerDecrement() {
    players.value = players.value.slice(0, players.value.length - 1);
    // WebSocketでプレイヤーの数の同期
    sendMsg({ name: "updatePlayers", players: players.value });
  }

  function handleModeChange() {
    mode.value = mode.value === "making" ? "playing" : "making";
    // WebSocketでつくる/あそぶモードの同期
    sendMsg({ name: "updateMode", mode: mode.value });
  }

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
    // WebSocketでプレイヤーとサイコロが回転しているかの同期
    sendMsg({ name: "updatePlayers", players: players.value });
    sendMsg({ name: "updateRolling", rolling: rolling.value });
    sendMsg({ name: "updateFinished", finished: finished.value });
  }

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
  function handlePlayerIncrement() {
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
    // WebSocketでプレイヤーの数の同期
    sendMsg({ name: "updatePlayers", players: players.value });
  }

  function handleSelectTool(event: MouseEvent) {
    // EventTarget型にvalueがないからキャストする必要があるようだ。
    const target = event.currentTarget as HTMLButtonElement;
    selectedTool.value = target.value as Tool;
    // WebSocketで選択中のツールの同期
    // sendMsg({ name: "updateSelectedTool", selectedTool: selectedTool.value });
  }

  return (
    // propsで丸ごと渡すと参照したいのか特定の更新をしたいのか分からないかも。
    <>
      <Board
        board={board}
        players={players}
        selectedTool={selectedTool}
        mode={mode}
        rolling={rolling}
        handleBoardTouchMove={handleBoardTouchMove}
        handleBoardPointerDown={handleBoardPointerDown}
        handleBoardPointerOver={handleBoardPointerOver}
      />
      {finished.value
        ? <Ranking players={players} />
        : (mode.value === "playing"
          ? (
            <PlayControll
              players={players}
              mode={mode}
              rolling={rolling}
              handlePlayerDecrement={handlePlayerDecrement}
              handleRolling={handleRolling}
              handleModeChange={handleModeChange}
              handlePlayerIncrement={handlePlayerIncrement}
            />
          )
          : (
            <>
              <ToolBar
                selectedTool={selectedTool}
                handleSelectTool={handleSelectTool}
              />
              <MakeControll handleModeChange={handleModeChange} />
            </>
          ))}
    </>
  );
}
