const express = require("express");
const app = express();

const cors = require("cors");
const PORT = 3000;

app.use(cors());
app.get("/", (req, res) => {
    res.send([
        {
            id: 1,
            name: "Hello world",
            done: false
        },
        {
            id: 2,
            name: "Buy milk",
            done: false
        },
        {
            id: 3,
            name: "Go out",
            done: true
        },
        {
            id: 4,
            name: "Testing",
            done: true
        },
    ])
})

app.listen(PORT, () => console.log("Server is running on port ", PORT))