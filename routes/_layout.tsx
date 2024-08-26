import { PageProps } from "$fresh/server.ts";
import TitleBar from "../components/TitleBar.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <body class="text-lg md:text-2xl  flex flex-col w-screen h-svh">
      <header class="w-full text-primary bg-secondary">
        <TitleBar />
      </header>
      <Component />
      <footer class="w-full text-primary bg-secondary flex flex-col text-center">
        <small>made by poeMoon0416</small>
        <a
          href="https://github.com/poeMoon0416"
          class="hover:text-acsent transition"
        >
          GitHub
        </a>
      </footer>
    </body>
  );
}
