const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");
const wishlistController = require("../controllers/wishlist.js");

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

// Wishlist routes
router.get("/wishlist", isLoggedIn, wrapAsync(wishlistController.showWishlist));
router.post("/wishlist/:id", isLoggedIn, wrapAsync(wishlistController.toggleWishlist));

module.exports = router;