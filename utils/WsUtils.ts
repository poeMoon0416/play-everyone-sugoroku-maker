import { Mode, Player, Tool } from "./SugorokuUtils.ts";

export type WsMsg =
  | { name: "updateBoard"; board: string[][] }
  | { name: "updatePlayers"; players: Player[] }
  | { name: "updateSelectedTool"; selectedTool: Tool }
  | { name: "updateMode"; mode: Mode }
  | { name: "updateRolling"; rolling: boolean }
  | { name: "updateFinished"; finished: boolean };
