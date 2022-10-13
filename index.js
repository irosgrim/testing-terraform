const express = require("express");
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

app.listen(PORT, () => console.log("Server is running on port ", PORT))