const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
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
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you Requested, does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//here it is same like we did in Creat Route [POST] but here we did it directly three dot means deconstruct the listing object
     req.flash("success","Listing Updated !")
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id); //this findByIdAndDelete() triggers the post middleware in [listing.js] models wala , 
    console.log(deletedListing);
     req.flash("success","Listing Deleted !")
    res.redirect("/listings");
};