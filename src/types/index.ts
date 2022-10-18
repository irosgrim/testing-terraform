export interface CustomWSClient extends WebSocket{
    clientId: number;
    username: string | number | null;
    roomId: string;
    isAdmin: boolean;
}

export type Rooms = {
    [key: string]: {
        clients: CustomWSClient[], 
        questions: MessageData
    }
}

export type Option = {
    text: string | number;
    votes?: (string | number)[];
}

export type MessageData = {
    description: string;
    options: Option[]
}

export type Results = {
    type: WS_MESSAGE_TYPE.RESULTS, 
    params: {
        data: Option[];
    }
} 
export type MessageParams = {
    roomId: string;
    username: string | number | null;
    message: string | number | null;
    data?: MessageData;
}

export type Votes = {
    votes: Option[];
}

export enum WS_MESSAGE_TYPE {
    CREATE = "create",
    JOIN = "join",
    LEAVE = "leave",
    MESSAGE = "message",
    VOTE = "vote",
    NEW_VOTE = "new-vote",
    SHOW_RESULTS = "show-results",
    RESULTS = "results",
    ERROR = "error",
    CLIENTS = "clients",
    SERVER_CLOSED = "server-closed",
    NEW_QUESTION = "new-question",
    SET_NEW_QUESTION = "set-new-question",
    INCORRECT_API_KEY = "incorrect-api-key",
}

export type SimpleMessage = {
    message: string;
}

export type WSMessage = {
    type: WS_MESSAGE_TYPE;
    params: MessageParams | Votes | SimpleMessage | { users: (string | number)[]};
}

export type VoteMessage = {
    type: WS_MESSAGE_TYPE.VOTE;
    params: {
        choice: number;
    }
}

export type WSError = {
    type: WS_MESSAGE_TYPE.ERROR,
    params: {
        message: string | null;
    }
}

export type ClientList = {
    type: WS_MESSAGE_TYPE.CLIENTS;
    params: {
        clients: (string | number)[];
    }
}
