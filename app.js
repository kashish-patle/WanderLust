

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const ExpressError = require("./utils/ExpressError.js");

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// Database Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Session Configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "development-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
};

app.use(session(sessionOptions));
// Flash Middleware
app.use(flash());

// Passport Configuration middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Available in EJS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});


app.get("/Demouser", async (req, res) => {
    let fakeuser = new User({ 
        email: "student@gmail.com",
        username: "student"
    });
    let registeredUser = await User.register(fakeuser, "helloworld");
    res.send(registeredUser);
});

// Listing Routes
const listingRouter = require("./routes/listing.js");
app.use("/listings", listingRouter);

// Review Routes
const reviewRouter = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewRouter);

// User Routes
const userRouter = require("./routes/user.js");
app.use("/", userRouter);

// Root Route
app.get("/", (req, res) => {
    res.send("Hi, I am Root");
});

// 404 Middleware
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
