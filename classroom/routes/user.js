const express = require("express");
const router = express.Router();

// Index route
router.get("/", (req, res) => {
    res.send("This is GET route for all users");
});

// Show route
router.get("/:id", (req, res) => {
    res.send(`This is GET route for user ${req.params.id}`);
});

// Create route
router.post("/", (req, res) => {
    res.send("This is POST route for creating a user");
});

// Delete route
router.delete("/:id", (req, res) => {
    res.send(`This is DELETE route for user ${req.params.id}`);
});

module.exports = router;