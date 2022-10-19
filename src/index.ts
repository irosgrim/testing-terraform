import "dotenv/config";
import { wsServer } from "./ws";
import server from "./server";

const PORT = process.env.PORT || 3000;
const app = server();

const srv = app.listen(PORT, () => console.log("Server is running on port ", PORT));

// START websocket server
srv.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});