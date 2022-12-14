import { ClientList, CustomWSClient, MessageParams, Rooms, WSError, WSMessage, WS_MESSAGE_TYPE, Results } from "../types";

export let ROOMS: Rooms = {};
export const users = [];

const ADMIN_USERNAME = "ADMIN";
const oldQuestions = {};
let clientId = 0;

export const testRooms = () => {
    return ROOMS;
}
export const sendListOfUsersThatVoteToNewUser = (roomId: string, client: CustomWSClient, rooms = ROOMS) => {
    const whoVoted: WSMessage = {
        type: WS_MESSAGE_TYPE.NEW_VOTE,
        params: {
            users: rooms[roomId].questions.options.map(x => x.votes).flatMap(x => x),
        }
    }
    client.send(JSON.stringify(whoVoted));
}

export const broadcastListOfUsersThatVote = (roomId: string, rooms = ROOMS) => {
    const whoVoted: WSMessage = {
        type: WS_MESSAGE_TYPE.NEW_VOTE,
        params: {
            users: rooms[roomId].questions.options.map(x => x.votes).flatMap(x => x),
        }
    }

    rooms[roomId].clients.forEach((client) =>{
        if (!client.isAdmin) {
            client.send(JSON.stringify(whoVoted));
        }
    });
}

export const disconnectAllSockets = (roomId: string, rooms = ROOMS) => {
    rooms[roomId].clients.forEach((client) =>{
        client.send(JSON.stringify({
            type: WS_MESSAGE_TYPE.SERVER_CLOSED
        }))
      client.close(1000, "Room is closed!");
    });
}

export const broadcastResults = (socket: CustomWSClient) => {
    const {isAdmin, roomId} = socket;

    if (isAdmin) {
        const showResults: Results = {
            type: WS_MESSAGE_TYPE.RESULTS,
            params: {
                data: ROOMS[roomId].questions.options
            }
        }
        ROOMS[roomId].clients.forEach((client) =>{
            if (!client.isAdmin) {
                client.send(JSON.stringify(showResults));
            }
        });
    }
}

export const broadcastListOfClients = (roomId: string, rooms = ROOMS) => {
    const clients: ClientList = {
        type: WS_MESSAGE_TYPE.CLIENTS,
        params: {
            clients: rooms[roomId].clients.map(x => x.username),
        }
    }

    rooms[roomId].clients.forEach((client) =>{
      client.send(JSON.stringify(clients));
    });
}

export const sendRoomExists = (socket) => {
    const err: WSError = {
        type: WS_MESSAGE_TYPE.ERROR,
        params: {
            message: "Room already exists",
        }
    }
    socket.send(JSON.stringify(err))
}

export const createRoom = (params: MessageParams, socket: CustomWSClient, rooms = ROOMS) => {
    const { roomId } = params;
    if (!roomId) {
        const err: WSError = {
            type: WS_MESSAGE_TYPE.ERROR,
            params: {
                message: "No room id provided",
            }
        }

        socket.send(JSON.stringify(err));
        socket.close(1000, "No room id provided");
        return;
    }

    if (rooms[roomId]) {
        sendRoomExists(socket);
        return;
    }

    socket.username = ADMIN_USERNAME;
    users.push(socket.username);
    socket.isAdmin = true;
    socket.roomId = roomId;
    
    rooms[roomId] = {
        clients: [],
        questions: null,
    }

    const choiceMapping = params.data.options.map(x => {
        x.votes = [];
        return x;
    });
    params.data.options = choiceMapping;
    clientId++;
    socket.clientId = clientId;
    rooms[roomId].clients = [socket];
    rooms[roomId].questions = params.data;
}

export const joinRoom = (params: MessageParams, socket: CustomWSClient, rooms = ROOMS) => {
    const { roomId } = params as MessageParams;

    if (!rooms[roomId] || !roomId) {
        const err: WSError = {
            type: WS_MESSAGE_TYPE.ERROR,
            params: {
                message: `Room ${roomId} does not exist or not provided!`
            }
        }
        
        socket.send(JSON.stringify(err));
        socket.close(1000, `Room ${roomId} does not exist or not provided!`);
        return;
    }

    const usernameExists = rooms[roomId].clients.filter(client => client.username === (params as MessageParams).username).length > 0;
    if(usernameExists) {
        socket.close(1000, `Username ${(params as MessageParams).username} is already taken!`);
        return;
    }
    clientId++;
    socket.clientId = clientId;
    socket.isAdmin = false;
    users.push(socket.username);
    socket.username = (params as MessageParams).username;
    socket.roomId = roomId;
    rooms[roomId].clients.push(socket);

    const questions: WSMessage = {
        type: WS_MESSAGE_TYPE.MESSAGE,
        params: {
            username: null,
            roomId: roomId,
            message: null,
            data: rooms[roomId].questions,
        }
    }

    socket.send(JSON.stringify(questions));
    broadcastListOfClients(roomId, rooms);
    sendListOfUsersThatVoteToNewUser(roomId, socket, rooms);
}

export const leaveRoom = (socket: CustomWSClient, rooms = ROOMS) => {
    const isAdmin = socket.isAdmin;
    const roomId = socket.roomId;
    if (rooms[roomId]) {
        const filteredClients = rooms[roomId].clients.filter(client => client.clientId !== socket.clientId);
        rooms[roomId].clients = filteredClients;
        const userIndex = users.indexOf(socket.username);
        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }

        broadcastListOfClients(roomId, rooms);

        if (isAdmin) {
            disconnectAllSockets(roomId)
            delete rooms[roomId];
        }
    }
}

export const sendMessageToAdmin = (message: WSMessage, roomId: string, rooms = ROOMS) => {
    const adminSocketIndex = rooms[roomId].clients.findIndex(x => x.username === ADMIN_USERNAME);

    if (adminSocketIndex > -1) {
        const adminSocket = rooms[roomId].clients[adminSocketIndex];
        adminSocket.send(JSON.stringify(message))
    }
}

export const vote = (params, socket, rooms = ROOMS) => {
    const {username, roomId} = socket;

    // user can only vote once. Remove any previous vote from the same user
    for (let i = 0; i< rooms[roomId].questions.options.length; i++) {
        const c = rooms[roomId].questions.options[i];
        const indexOfPrevVote = c.votes.indexOf(username);
        if (indexOfPrevVote > -1) {
            c.votes.splice(indexOfPrevVote, 1);
        }
    }

    const numberOfChoices = rooms[roomId].questions.options.length - 1;
    const choice = (params.choice >= 0 && params.choice <= numberOfChoices) ? params.choice : 0;
    rooms[roomId].questions.options[choice].votes.push(username);
    
    const privateVotes: WSMessage = {
        type: WS_MESSAGE_TYPE.NEW_VOTE,
        params: {
            votes: rooms[roomId].questions.options
        }
    }

    sendMessageToAdmin(privateVotes, roomId, rooms);
    broadcastListOfUsersThatVote(roomId, rooms);
}

export const broadcastNewQuestion = (roomId: string) => {
    const questions: WSMessage = {
        type: WS_MESSAGE_TYPE.SET_NEW_QUESTION,
        params: {
            username: null,
            roomId: roomId,
            message: null,
            data: ROOMS[roomId].questions,
        }
    }

    ROOMS[roomId].clients.forEach((client) =>{
        if (!client.isAdmin) {
            client.send(JSON.stringify(questions));
        }
    });
}

export const newQuestion = (params: MessageParams, socket: CustomWSClient) => {
    const { isAdmin, roomId} = socket;
    if (isAdmin) {
        // preserve history
        // if (oldQuestions[roomId]) {
        //     oldQuestions[roomId].push(rooms[roomId].questions);
        // } else {
        //     oldQuestions[roomId] = [rooms[roomId].questions];
        // }
        const choiceMapping = params.data.options.map(x => {
            x.votes = [];
            return x;
        });
        params.data.options = choiceMapping;
        ROOMS[roomId].questions = params.data;
        broadcastNewQuestion(roomId);
        // socket.send(JSON.stringify(oldQuestions[roomId]));
    }
}
