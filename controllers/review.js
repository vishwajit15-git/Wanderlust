const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success","New Review Created !")
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//aslo delete from Listing.reviews[] array.  fro this purpose we use $pull operator
    await Review.findByIdAndDelete(reviewId); //Delete from Review collection, but it will be in Listing collection that also in reviews array.
     req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`);
};