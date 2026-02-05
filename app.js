const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");

//this all are now not used here we have used them in there perspective route files ,we can removw this from here but we keep it as here for understanding
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");
const wrapAsync=require("./utils/wrapAsync.js");
const Listing=require("./models/listing.js");


const listings=require("./routes/listing.js"); //required the listing routes 
const reviews=require("./routes/review.js"); //required the review routes 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(cookieParser());

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

//=================Cookies======================\\

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.send("HI,Iam cookie");
});

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie send");
})

app.get("/verified",(req,res)=>{
    console.log(req.signedCookies);
    res.send("Verified");
})

// =========================================\\

const sessionOptions={secret:"mysecretstring",resave:false,saveUninitialized:true,cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
},};

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("HI,Iam Groot");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});


//USE THE IMPORTED ROUTES HERE
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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