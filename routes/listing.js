const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");  //we use double dots so we can access parent directory to access all these requirements
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

const listingController=require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.array('listing[images]',10),validateListing,wrapAsync(listingController.newListing));

router.get("/search",wrapAsync(listingController.searchListings));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(validateListing,isLoggedIn,isOwner,upload.array('listing[images]',10),wrapAsync(listingController.editListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    // if category is present → filter
    if (category) {
      filter.category = category;
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", { allListings, category });

    console.log("REQ QUERY:", req.query);
console.log("FILTER USED:", filter);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports=router;