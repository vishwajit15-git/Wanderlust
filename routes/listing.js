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
    .post(isLoggedIn,validateListing,upload.single('listing[image.url]'),wrapAsync(listingController.newListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(validateListing,isLoggedIn,isOwner,wrapAsync(listingController.editListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;