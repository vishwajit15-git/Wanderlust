const Listing=require("../models/listing.js");
const axios = require("axios");

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.searchListings=async(req,res)=>{
    try {
        const {destination}=req.query;
        
        if(!destination || destination.trim()===""){
            req.flash("error","Please enter a destination to search");
            return res.redirect("/listings");
        }
        
        // Search by location or country (case-insensitive)
        const searchListings=await Listing.find({
            $or:[
                {location:{$regex:destination,$options:"i"}},
                {country:{$regex:destination,$options:"i"}}
            ]
        });
        
        if(searchListings.length===0){
            req.flash("error",`No listings found for "${destination}". Try another destination!`);
            return res.redirect("/listings");
        }
        
        req.flash("success",`Found ${searchListings.length} listing(s) in "${destination}"`);
        res.render("listings/index.ejs",{allListings:searchListings});
    } catch(err){
        req.flash("error","Something went wrong with your search");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you Requested, does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.newListing=async (req, res) => {
        const MAP_TOKEN = process.env.MAP_TOKEN;

    const location = req.body.listing.location;
    const encodedLocation = encodeURIComponent(location);
    const maptilerUrl = `https://api.maptiler.com/geocoding/${encodedLocation}.json?limit=1&key=${MAP_TOKEN}`;

    const response = await axios.get(maptilerUrl);

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.geometry = response.data.features[0].geometry;
    
    // Handle multiple images
    if(req.files && req.files.length > 0) {
        newListing.images = req.files.map(file => ({
            filename: file.filename,
            url: file.path
        }));
        // Set first image as main image
        newListing.image = {
            filename: req.files[0].filename,
            url: req.files[0].path
        };
    } else if(req.file) {
        // Fallback for single file
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
        newListing.images=[{url,filename}];
    }
    
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you Requested, does not exist !");
        return res.redirect("/listings");
    }

    let originalImageUrl=listing.image && listing.image.url ? listing.image.url : "https://unsplash.com/photos/coconut-tree-near-body-of-water-HfIex7qwTlI";
    if(originalImageUrl.includes("/upload")) {
        originalImageUrl=originalImageUrl.replace("/upload","/upload/")
    }
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    
    if(req.files && req.files.length > 0) {
        listing.images = req.files.map(file => ({
            filename: file.filename,
            url: file.path
        }));
        // Set first image as main image
        listing.image = {
            filename: req.files[0].filename,
            url: req.files[0].path
        };
        await listing.save();
    } else if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        listing.images=[{url,filename}];
        await listing.save();
    }
    
    req.flash("success","Listing Updated !")
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id); //this findByIdAndDelete() triggers the post middleware in [listing.js] models wala , 
    console.log(deletedListing);
     req.flash("success","Listing Deleted !")
    res.redirect("/listings");
};