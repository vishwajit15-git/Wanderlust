const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.toggleWishlist = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.user._id);
    let wishlisted;
    if (user.wishlist.some(listingId => listingId.equals(id))) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: id } });
        wishlisted = false;
    } else {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: id } });
        wishlisted = true;
    }
    res.json({ wishlisted });
};

module.exports.showWishlist = async (req, res) => {
    let user = await User.findById(req.user._id).populate("wishlist");
    res.render("listings/wishlist.ejs", { wishlistListings: user.wishlist });
};
