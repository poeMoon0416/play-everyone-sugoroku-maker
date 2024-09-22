const rooms = new Map<string, Set<WebSocket>>();

export const handler = (req: Request) => {
  // socket: 送信者のws接続
  const { socket, response } = Deno.upgradeWebSocket(req);
  const url = new URL(req.url);
  const roomId = url.pathname.split("/").pop() ?? "";

  // ルーム作成と参加
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set<WebSocket>());
  }
  const roomClients = rooms.get(roomId)!;
  roomClients.add(socket);

  socket.onopen = () => {
    console.log(`Client connected to room: ${roomId}`);
  };

  // メッセージをルーム内のユーザに横流し
  socket.onmessage = (event) => {
    const msg = event.data;
    console.log(`Message received in room ${roomId}: ${msg}`);

    for (const client of roomClients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  };

  // ws接続を削除、空になったらルームを削除
  socket.onclose = () => {
    console.log(`Client disconnected from room: ${roomId}`);
    roomClients.delete(socket);
    if (roomClients.size === 0) {
      rooms.delete(roomId);
    }
  };

  socket.onerror = (e) => {
    console.error("WebSocket error:", e);
  };

  return response;
};
