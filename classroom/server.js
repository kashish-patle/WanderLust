const express = require("express");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");

// Session configuration
const sessionOptions = {
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
};

// Middleware
app.use(session(sessionOptions));
app.use(flash());

// res.locals middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Register route
app.get("/register", (req, res) => {
    let { name = "Guest" } = req.query;

    req.session.name = name;

    req.flash("success", `Welcome, ${name}! You have been registered.`);

    res.redirect("/hello");
});

// Error route
app.get("/error", (req, res) => {
    req.flash("error", "Something went wrong!");
    res.redirect("/hello");
});

// Hello route
app.get("/hello", (req, res) => {
    res.render("page.ejs", {
        name: req.session.name || "Guest"
    });
});

// Test route
app.get("/test", (req, res) => {
    res.send("Test successful");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});