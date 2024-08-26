import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import { Tool } from "../utils/SugorokuUtils.ts";

interface ToolBarProps {
  selectedTool: Signal<Tool>;
}

export default function ToolBar(
  { selectedTool }: ToolBarProps,
) {
  const TOOLS: Tool[] = [
    "ノーマル",
    "スタート",
    "ゴール",
    "1すすむ",
    "もう1回",
    "",
  ];

  return (
    <section class="text-sm md:text-2xl *:p-1.5 md:*:p-4  flex flex-row items-center *:transition text-primary bg-secondary rounded-lg border-4 border-slate-700">
      {TOOLS.map((tool) => (
        <button
          name="tool"
          value={tool}
          class={`hover:text-acsent ${
            tool === selectedTool.value ? "text-acsent" : ""
          }`}
          onClick={(event) =>
            selectedTool.value = event.currentTarget.value as Tool}
        >
          {tool ? tool : "とりけし"}
        </button>
      ))}
    </section>
  );
}
