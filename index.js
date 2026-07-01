const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

let announcements = [];
let nextId = 1;

function cleanup() {
    announcements = announcements.filter(a => a.expiresAt > Date.now());
}

function addAnnouncement(message) {
    announcements.push({
        id: nextId++,
        message: message,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 1000
    });
}

setInterval(() => {
    announcements = announcements.filter(a => a.expiresAt > Date.now());
}, 30 * 1000);

addAnnouncement("TEST ANNOUNCEMENT");

// PING
app.get("/", (req, res) => {
    res.send("Hello World");
});

// GLOBAL MESSAGE
app.get("/global-message", (req, res) => {
    cleanup();
    res.json(announcements);
});

//
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});