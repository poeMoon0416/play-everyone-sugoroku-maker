import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>みんなであそべるすごろくメーカー</title>
        <meta
          name="description"
          content="すごろくを書いたノートの代わりに画面の前に集まって、みんなであそべるすごろくメーカーです！"
        />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <Component />
    </html>
  );
}
