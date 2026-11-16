const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("mySecretKey"));

// const userRouter = require("./routes/user.js");
// const postRouter = require("./routes/post.js");

// // User routes
// app.use("/users", userRouter);
// // Post routes
// app.use("/posts", postRouter);


// Send signed cookie
app.get("/getsignedcookie", (req, res) => {
    res.cookie("name", "Kashish", { signed: true });
    res.send("Signed cookie sent!");
});

// Read signed cookie
app.get("/", (req, res) => {
    console.log("Signed Cookies:", req.signedCookies);
    res.send("Hello!"+`${req.signedCookies.name }`);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});