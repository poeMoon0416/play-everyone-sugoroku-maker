export default function TitleBar() {
  return (
    <nav class="flex-wrap *:p-2 md:*:p-4  flex flex-row items-center *:transition">
      <div class="w-screen md:w-auto  flex flex-row items-center">
        <img
          src="/favicon.ico"
          alt="みんなで遊べるすごろくメーカーのロゴ"
          width="32"
          class="aspect-square object-contain"
        />
        <h1 class="text-slate-300">みんなであそべるすごろくメーカー</h1>
      </div>
    </nav>
  );
}
