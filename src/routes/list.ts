import express from "express";

const list = express();

list.get("/", (req, res) => {
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
    ]);
});

export default list;