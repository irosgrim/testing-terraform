const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 3000;

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
        {
            id: 5,
            name: "Testing 2",
            done: true
        },
        {
            id: 6,
            name: "Testing 3",
            done: true
        },
        {
            id: 7,
            name: "Testing 4",
            done: true
        },
        {
            id: 8,
            name: "Testing 5",
            done: true
        },
        {
            id: 9,
            name: "Testing 6",
            done: true
        },
        
    ])
})

app.listen(PORT, () => console.log("Server is running on port ", PORT))