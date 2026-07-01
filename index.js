const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/global-message", (req, res) => {
    res.send("{type=announcement, duration=-1, color=#ff0000}TEST");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});