
const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

// Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
}));

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listing/new.ejs");
});

// CREATE ROUTE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");

    res.redirect(`/listings/${newListing._id}`);
}));

// EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listing/edit.ejs", { listing });
}));

// UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );

    if (!updatedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing updated successfully!");

    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully!");

    res.redirect("/listings");
}));

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listing/show.ejs", { listing });
}));

module.exports = router;
