
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");


const { listingSchema, reviewSchema } = require("./schema.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

// Database Connection
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



//all listing routes are moved to listing.js file and all review routes are moved to review.js file
const listingRouter = require("./routes/listing.js");
app.use("/listings", listingRouter);


//all review routes are moved to review.js file
const reviewRouter = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewRouter);

//root route
app.get("/", (req, res) => {
    res.send("Hi, I am Root");
});


// 404 MIDDLEWARE
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// SERVER
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
