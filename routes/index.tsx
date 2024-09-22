import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req) {
    const room = crypto.randomUUID();
    return new Response(null, {
      // <ルームIDの変更タイミング>
      // サイト訪問時(/にアクセス)
      // ユーザの明示的なリセット時(url直打ち)
      // 404エラー発生時
      // ----------
      // <リダイレクト動作確認結果>
      // 307 Temporary Redirect: 飛び先毎回変化(再計算)
      // 308 Permanent Redirect: 飛び先固定化(キャッシュ)
      status: 307,
      statusText: "Temporary Redirect",
      headers: { "Location": `/room/${room}/` },
    });
  },
};
