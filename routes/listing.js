const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");  //we use double dots so we can access parent directory to access all these requirements
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");

//Index Route 
router.get("/",wrapAsync(listingController.index));

//Create New[GET]
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Route (Each individual listing)
router.get("/:id",wrapAsync(listingController.showListing));

//Create Route[POST]
router.post("/",validateListing, isLoggedIn,wrapAsync(listingController.newListing));


//Update Route [GET ID]
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route [PUT ID]
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;