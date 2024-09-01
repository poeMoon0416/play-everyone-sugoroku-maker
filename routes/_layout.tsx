import { PageProps } from "$fresh/server.ts";
import TitleBar from "../components/TitleBar.tsx";
import Nav from "../components/Nav.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <body class="text-lg md:text-2xl  flex flex-col w-full h-svh">
      <header class="*:p-1 md:*:p-4  flex flex-row flex-wrap w-full text-primary bg-secondary">
        <TitleBar />
        <Nav />
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
