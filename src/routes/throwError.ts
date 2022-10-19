import express from "express";

const throwError = express();

throwError.get("/", (req, res) => {
    res.status(404).send("intentional error");
});

export default throwError;