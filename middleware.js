const Listing=require("./models/listing.js"); 
const Review=require("./models/reviews.js");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        if (req.session) {
            req.session.redirectUrl = req.originalUrl;
        } else {
            res.locals.redirectUrl = req.originalUrl;
        }
        req.flash("error","Login to create new Listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session && req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(","); //if we want to print all errors in details object from error 
        throw new ExpressError(400,errmsg);   // here pass errmsg instead of error;
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
