import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../utils/constants";
import { apiKeyIsValid } from "../utils/lib"

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const { api_key: apiKey } = req.query as {api_key: string | undefined};
    if (!apiKeyIsValid(apiKey)) {
        res.status(401).send(HTTP_STATUS.UNAUTHORISED);
        return;
    }
    next();
}