import { MessageParams, Rooms, WS_MESSAGE_TYPE } from "../../types"
import { joinRoom } from "../../ws/ws"
import { socket } from "../../__mocks__/mocks"

describe("websocket: join room", () => {
    let roomId = "wrong-room";
    let username = "test-username";
    const params: MessageParams = {
        roomId: roomId,
        username: username,
        message: null,
    }

    let rooms: Rooms = {
        "test-room": {
            clients: [],
            questions: {
                description: "test description",
                options: [
                    {
                        text: "aaaa",
                        votes: []
                    },
                    {
                        text: "ssss",
                        votes: []
                    }
                ]
            }
        },
         "test-room-2": {
            clients: [],
            questions: {
                description: "test description2",
                options: [
                    {
                        text: "aaaa",
                        votes: []
                    },
                    {
                        text: "ssss",
                        votes: []
                    }
                ]
            }
        },
        "test-room-3": {
            clients: <any>[{username: username}],
            questions: {
                description: "test description2",
                options: [
                    {
                        text: "aaaa",
                        votes: []
                    },
                    {
                        text: "ssss",
                        votes: []
                    }
                ]
            }
        }
    }

    
    it("sends correct error message if room id is incorrect", () => {
        joinRoom(params, <any>socket, rooms);
        const errorMessage = {
            type: WS_MESSAGE_TYPE.ERROR,
            params: {
                message: `Room ${roomId} does not exist or not provided!`,
            }
        }
        expect(socket.send).toBeCalledWith(JSON.stringify(errorMessage));
        expect(socket.close).toBeCalled();
    });

    it("joins the correct room", () => {
        roomId = "test-room";
        params.roomId = roomId;
        joinRoom(params, <any>socket, rooms);
        const expectedUsername = rooms[roomId].clients[0].username
        expect(expectedUsername).toBe(username);

        roomId = "test-room-2";
        params.roomId = roomId;
        joinRoom(params, <any>socket, rooms);
        const expectedUsername2 = rooms[roomId].clients[0].username
        expect(expectedUsername2).toBe(username);
    });

    it("cant't join when the username is already taken", () => {
        roomId = "test-room-3";
        params.roomId = roomId;
        joinRoom(params, <any>socket, rooms);
        expect(socket.close).toBeCalled();
    });
    
})