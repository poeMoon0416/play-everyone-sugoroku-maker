interface MakeControllProps {
  handleModeChange: () => void;
}

export default function MakeControll(
  { handleModeChange }: MakeControllProps,
) {
  return (
    <button
      name="play"
      value="play"
      class="whitespace-nowrap text-primary bg-secondary aspect-square rounded-full border-4 border-slate-700 p-2 hover:text-acsent transition"
      onClick={handleModeChange}
    >
      あそぶ！
    </button>
  );
}
