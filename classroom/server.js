const express = require("express");
const app = express();

const userRouter = require("./routes/user.js");
const postRouter = require("./routes/post.js");

// User routes
app.use("/users", userRouter);

// Post routes
app.use("/posts", postRouter);




app.get("/", (req, res) => {
    res.send("Hello World");
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});