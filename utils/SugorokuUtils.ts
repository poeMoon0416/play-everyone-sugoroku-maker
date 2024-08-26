export interface Player {
  row: number;
  col: number;
  dice: number;
  isCurrent: boolean;
  prevDirec: string;
  bgColor: string;
  position: string;
  progress: number;
}

export type Mode = "making" | "playing";

export type Tool =
  | "ノーマル"
  | "スタート"
  | "ゴール"
  | "1すすむ"
  | "もう1回"
  | "";
