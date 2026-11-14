
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");

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

// INDEX ROUTE
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
});

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
});

// CREATE ROUTE
// app.post("/listings", async (req, res, next) => {
//     try {
//         const listingData = req.body.listing;

//         if (!/^[0-9]+$/.test(String(listingData.price)) ||
//             Number(listingData.price) <= 0) {
//             return res.status(400).send("Invalid price! Please enter numbers only.");
//         }

//         const newListing = new Listing(listingData);
//         await newListing.save();

        
//     } catch (err) {
//         next(err);
//     }
// });  
 // CREATE ROUTE
app.post("/listings", async (req, res, next) => {
    try {
        const listingData = req.body.listing;

        if (!/^[0-9]+$/.test(String(listingData.price)) ||
            Number(listingData.price) <= 0) {
            throw new ExpressError(400, "Invalid price! Please enter numbers only.");
        }

        const newListing = new Listing(listingData);
        await newListing.save();

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
}); 

// EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
});

// UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
});

// ROOT ROUTE
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
