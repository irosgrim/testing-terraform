import { Rooms } from "../../types";
import { vote } from "../../ws/ws";

describe("websocket: vote", () => {
    const socket = {
        username: "testUsername",
        roomId: "testRoom",
    }
    const rooms: Rooms = {
        "testRoom": {
            clients: [],
            questions: {
                description: "",
                options: [
                    {
                        text: "my title 1",
                        votes: [],
                    },
                    {
                        text: "my title 2",
                        votes: [],
                    },
                    {
                        text: "my title 3",
                        votes: [],
                    },
                    {
                        text: "my title 4",
                        votes: [],
                    }
                ]
            }
        }
    };

    for (const choice of [0, 1, 2, 3]) {
        socket.username = "test" + choice;
        it("votes correct choice", () => {
            vote({choice}, socket, rooms);
            expect(rooms["testRoom"].questions.options[choice].votes[0]).toBe(socket.username);
        })
    }

    for (const choice of [0, 1, 2, 3]) {
        // socket.username = "test" + choice;
        it("votes correct choice", () => {
            vote(0, {username: "test" + choice, roomId: "testRoom"}, rooms);
            expect(rooms["testRoom"].questions.options[0].votes.length).toBe(choice + 1);
        })
    }
})