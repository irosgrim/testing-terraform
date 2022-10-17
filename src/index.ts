import express from "express";
import { wsServer } from "./ws";

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get("/list", (req, res) => {
    res.send([
        {
            id: 1,
            title: "Buy a Billy",
            done: false
        },
        {
            id: 2,
            title: "Buy a zebra pattern rug",
            done: false
        },
        {
            id: 3,
            title: "Eat some köttbullar",
            done: true
        },
    ])
})

app.get("/list-db", (req, res) => {
    res.status(404).send();
    
    // res.send([
    //     {
    //         id: 1,
    //         title: "Buy a Billy",
    //         done: false
    //     },
    //     {
    //         id: 2,
    //         title: "Buy a zebra pattern rug",
    //         done: false
    //     },
    //     {
    //         id: 3,
    //         title: "Eat some köttbullar",
    //         done: true
    //     },
    // ])
})

const server = app.listen(PORT, () => console.log("Server is running on port ", PORT));

// START websocket server
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});