const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");  //we use double dots so we can access parent directory to access all these requirements
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

// //Index Route 
// router.get("/listings",wrapAsync(async(req,res)=>{
//     let allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

//IMP IMP IMP IMP IMP IMP IMP IMP IMP
//AS U CAN SEE in all paths [listings] word is common so we can remove it.Check above commented INDEX ROUTE IT CONTAINS /listings but from now we will remove it in remaining all paths.

//Index Route 
router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//Create New[GET]
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route (Each individual listing)
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you Requested, does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Create Route[POST]
router.post("/",validateListing, isLoggedIn,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
}));


//Update Route [GET ID]
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you Requested, does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//Update Route [PUT ID]
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//here it is same like we did in Creat Route [POST] but here we did it directly three dot means deconstruct the listing object
     req.flash("success","Listing Updated !")
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id); //this findByIdAndDelete() triggers the post middleware in [listing.js] models wala , 
    console.log(deletedListing);
     req.flash("success","Listing Deleted !")
    res.redirect("/listings");
}));

module.exports=router;