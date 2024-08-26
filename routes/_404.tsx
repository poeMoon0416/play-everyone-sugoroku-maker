import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>ページがみつかりません | みんなであそべるすごろくメーカー</title>
      </Head>
      <main class="w-screen h-svh flex-1 text-secondary bg-primary flex flex-col *:p-4">
        <div class="flex-1 bg-[url('/favicon.ico')] bg-center bg-repeat-x bg-contain" />
        <h1 class="text-center text-6xl font-bold">ページがみつかりません</h1>
        <a
          href="/"
          class="text-center text-4xl underline hover:text-acsent transition"
        >
          トップにもどる
        </a>
      </main>
    </>
  );
}
