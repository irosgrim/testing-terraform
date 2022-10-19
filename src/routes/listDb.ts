import express from "express";
import DB from "../db";
import { Heroes } from "../db/getListOfHeroes";

const listDb = express();

const topOfHeroes = (heroes: Heroes) => {
    return async (req, res) => {
        const {rows: h}= await heroes.getHallOfFame(10);
        res.status(200).send(h || []);
    }
}

listDb.get("/", topOfHeroes(new Heroes(DB)));

export default listDb

