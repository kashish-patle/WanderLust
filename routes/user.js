
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// ================= SIGNUP =================

// Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup Route
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// ================= LOGIN =================

// Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login Route
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back to WanderLust!");

        const redirectUrl = res.locals.redirectUrl ;

        delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);

// ================= LOGOUT =================

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
