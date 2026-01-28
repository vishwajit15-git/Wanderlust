const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
                
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("HI,Iam Groot");
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"Grand 3BHK Villa",
//         description:"Luxurous Villa",
//         price:20000,
//         location:"Pune,Maharashtra",
//         country:"India"
//     });

//     await sampleListing.save().then((res)=>console.log(res)).catch((err)=>console.log(err))
//     console.log("Sample was saved!");
//     res.send("Succesfull");
// });


//JOI Middleware
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(","); //if we want to print all errors in details object from error 
        throw new ExpressError(400,errmsg);   // here pass errmsg instead of error;
    }
    else{
        next();
    }
};

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



//Index Route 
app.get("/listings",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//Create New[GET]
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route (Each individual listing)
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Create Route[POST]
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Update Route [GET ID]
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//Update Route [PUT ID]
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//here it is same like we did in Creat Route [POST] but here we did it directly three dot means deconstruct the listing object
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id); //this findByIdAndDelete() triggers the post middleware in [listing.js] , 
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Reviews [POST route]
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= await Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Review DELETE ROUTE
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//aslo delete from Listing.reviews[] array.  fro this purpose we use $pull operator
    await Review.findById(reviewId); //Delete from Review collection, but it will be in Listing collection that also in reviews array.
    res.redirect(`/listings/${id}`);
}));

//To test Page not found error
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is listening to port: 8080");
})