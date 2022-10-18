export const API_KEY = process.env.API_KEY;

export const apiKeyIsValid = (apiKey: string | undefined) => {
    return (apiKey && API_KEY) && (apiKey === API_KEY);
}