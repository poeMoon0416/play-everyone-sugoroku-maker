import Sugoroku from "../islands/Sugoroku.tsx";

export default function MakingPlayPage() {
  // onClick等はislandsに書く
  return (
    <main class="flex-1 flex flex-col justify-center items-center p-4 gap-4 text-secondary bg-primary">
      <Sugoroku />
    </main>
  );
}
