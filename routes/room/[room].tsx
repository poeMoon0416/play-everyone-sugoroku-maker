import { Handlers, PageProps } from "$fresh/server.ts";
import Sugoroku from "../../islands/Sugoroku.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    const url = req.url;
    return ctx.render({ url });
  },
};

export default function MakingPlayPage({ data }: PageProps) {
  // onClick等はislandsに書く
  return (
    <main class="flex-1 flex flex-col justify-center items-center p-4 gap-4 text-secondary bg-primary">
      <Sugoroku url={data.url} />
    </main>
  );
}
