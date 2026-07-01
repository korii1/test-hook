const express = require("express");
const app = express();

app.use(express.text());

// Render gives dynamic port
const PORT = process.env.PORT || 3000;

let announcements = [];
let nextId = 1;

// cleanup helper
function cleanup() {
    const now = Date.now();
    announcements = announcements.filter(a => a.expiresAt > now);
}

// add message
function addAnnouncement(message) {
    announcements.push({
        id: nextId++,
        message,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 1000
    });
}

// periodic cleanup
setInterval(cleanup, 30 * 1000);

// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("OK");
});

// GET messages
app.get("/global-message", (req, res) => {
    cleanup();

    res.json(
        announcements.map(a => ({
            id: a.id,
            message: a.message
        }))
    );
});

// POST message
app.post("/global-message", (req, res) => {
    const msg = req.body;

    if (!msg || msg.trim() === "") {
        return res.status(400).json({ error: "Missing message" });
    }

    addAnnouncement(msg);
    res.send("SUCCESS");
});

// IMPORTANT: bind to 0.0.0.0 for hosting platforms
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});