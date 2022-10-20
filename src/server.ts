import express from "express";
import cors from "cors";
import { auth } from "./middleware/auth";
import list from "./routes/list";
import listDb from "./routes/listDb";
import throwError from "./routes/throwError";

const server = () => {
    const app = express();

    app.use(cors());
    app.use(auth);
    
    app.use("/list", list)
    // app.use("/list-db", listDb);
    app.use("/throw-error", throwError)

    return app;
}

export default server;
