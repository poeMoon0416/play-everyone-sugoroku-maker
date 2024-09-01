export default function TitleBar() {
  return (
    <div class="w-full md:w-auto flex flex-row items-center">
      <a href="/">
        <img
          src="/favicon.ico"
          alt="みんなで遊べるすごろくメーカーのロゴ"
          width="32"
          class="aspect-square object-contain"
        />
      </a>
      <h1 class="text-slate-300">
        <a href="/">みんなであそべるすごろくメーカー</a>
      </h1>
    </div>
  );
}
