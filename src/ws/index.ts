import WebSocket from "ws";
import { MessageParams, VoteMessage, WSMessage, WS_MESSAGE_TYPE } from "../types";
import { apiKeyIsValid } from "../utils/lib";
import { broadcastResults, createRoom, joinRoom, leaveRoom, newQuestion, vote } from "./ws";
import URL from "url";

export const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on('connection', (socket, req) => {
    const { url } = req;
    const { api_key: apiKey } = URL.parse(url, true).query as {api_key: string};
    // TODO: try check ip
    const ip = req.socket.remoteAddress;

    // TODO: use url for some basic authentication
    console.log("New client connected from IP: ", ip);
    console.log("URL: ", url);

    socket.on('message', message => {
        if (!apiKeyIsValid(apiKey)) {
            socket.send(JSON.stringify({
                type: WS_MESSAGE_TYPE.INCORRECT_API_KEY,
                params: {
                    message: "Incorrect api key!"
                }
            }));
            console.log("Incorrect api key!");
            socket.close();
            return;
        }

        const { type, params } = <WSMessage | VoteMessage>JSON.parse(message);
        switch (type) {
            case WS_MESSAGE_TYPE.CREATE:
                createRoom(params as MessageParams, socket);
                break;
            case WS_MESSAGE_TYPE.JOIN:
                joinRoom(params as MessageParams, socket);
                break;
            case WS_MESSAGE_TYPE.LEAVE:
                // leaveRoom(socket);
                break;
            case WS_MESSAGE_TYPE.MESSAGE:
                console.log("Not implemented!")
                break;     
            case WS_MESSAGE_TYPE.VOTE:
                vote(params, socket);
                break;
            case WS_MESSAGE_TYPE.SHOW_RESULTS:
                broadcastResults(socket);
                break; 
            case WS_MESSAGE_TYPE.NEW_QUESTION:
                newQuestion(params as MessageParams, socket);
                break; 
            default:
                console.log(`${type} not known`);
                console.log(message)
                break;
        }
    });

    socket.on('close', (message) => {
        console.log("client left the building: ", message);
        leaveRoom(socket);
    })

});

wsServer.on("close", (socket) => {
    const closeMessage: WSMessage = {
        type: WS_MESSAGE_TYPE.SERVER_CLOSED,
        params: {
            message: "Server closed",
        }
    }
    socket.send(JSON.stringify(closeMessage));
})
