import { MessageParams, Rooms } from "../../types";
import { createRoom } from "../../ws/ws";
import { socket } from "../../__mocks__/mocks";

describe("websocket: create room", () => {
    const params: MessageParams = {
        roomId: "testRoom",
        username: "testUsername",
        message: "hello",
        data: {
            description: "test description",
            options: [
                {
                    text: "option 1",
                    votes: [1, 2, 3]
                },
                {
                    text: "option 2",
                    votes: [1, 2, 3]
                },
                {
                    text: "option 3",
                    votes: [1, 2, 3]
                }
            ]
        }
    }

    

    let rooms: Rooms = {};

    // @ts-ignore
    createRoom(params, socket, rooms);

    it("creates correct rooms", () => {
        expect(rooms["testRoom"]).toBeDefined();
        expect(rooms["testRoom"].questions.description).toBe("test description");

    })

    it("maps options correctly", () => {
        const optionsMapping = rooms["testRoom"].questions.options.map(x => x.votes);
        // @ts-ignore
        expect(JSON.stringify(optionsMapping)).toBe(JSON.stringify([[], [], []]));
    })

    it("send error message if room already exists", () => {
        // @ts-ignore
        createRoom(params, socket, rooms);
        const errorMessage = {
            type: "error",
            params: {
                message: "Room already exists",
            }
        }
        expect(socket.send).toBeCalledWith(JSON.stringify(errorMessage))
    })

    it("send error message if roomId not provided", () => {
        params.roomId = "";
        // @ts-ignore
        createRoom(params, socket, rooms);
        const errorMessage = {
            type: "error",
            params: {
                message: "No room id provided",
            }
        }
        expect(socket.send).toBeCalledWith(JSON.stringify(errorMessage));

    })
    
})