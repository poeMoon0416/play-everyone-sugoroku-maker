// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $index from "./routes/index.tsx";
import * as $usage from "./routes/usage.tsx";
import * as $Sugoroku from "./islands/Sugoroku.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/index.tsx": $index,
    "./routes/usage.tsx": $usage,
  },
  islands: {
    "./islands/Sugoroku.tsx": $Sugoroku,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
