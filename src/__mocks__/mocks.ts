
export const socket = {
    send: jest.fn().mockImplementation((arg) => arg),
    close: jest.fn().mockImplementation((code, message) => ({code, message})),
    username: null,
};