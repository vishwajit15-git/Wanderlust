const express=require("express");
const router=express.Router({mergeParams:true}); //we sent this parameter because here when we cut the commom part ie  [/listings:id/reviews] we cannot get the id for our listing and it gives error so we merge the params of the parent route i.e our commom route with child paths .
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

//JOI Middleware
const validateReview = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ExpressError(400, "Review body is required"));
    }
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errmsg));
    }
    next();
};


//Here the common part for the reviews is [/listings:id/reviews] remove it from this file

//Reviews [POST route]
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Review DELETE ROUTE
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//aslo delete from Listing.reviews[] array.  fro this purpose we use $pull operator
    await Review.findByIdAndDelete(reviewId); //Delete from Review collection, but it will be in Listing collection that also in reviews array.
    res.redirect(`/listings/${id}`);
}));


module.exports=router;