const express = require("express");
const router = express.Router();

// Index route - Get all posts
router.get("/", (req, res) => {
    res.send("This is GET route for all posts");
});

// Show route - Get one post
router.get("/:id", (req, res) => {
    res.send(`This is GET route for post ${req.params.id}`);
});

// Create route - Add a post
router.post("/", (req, res) => {
    res.send("This is POST route for creating a post");
});

// Delete route - Delete one post
router.delete("/:id", (req, res) => {
    res.send(`This is DELETE route for post ${req.params.id}`);
});

module.exports = router;