const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.toggleWishlist = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.user._id);
    if (user.wishlist.some(listingId => listingId.equals(id))) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: id } });
        req.flash("success", "Removed from Wishlist!");
    } else {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: id } });
        req.flash("success", "Added to Wishlist!");
    }
    let redirectUrl = req.get("Referer") || "/listings";
    res.redirect(redirectUrl);
};

module.exports.showWishlist = async (req, res) => {
    let user = await User.findById(req.user._id).populate("wishlist");
    res.render("listings/wishlist.ejs", { wishlistListings: user.wishlist });
};
