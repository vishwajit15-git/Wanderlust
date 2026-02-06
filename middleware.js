module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
    req.flash("error","Login to create new Listing!");
    return res.redirect("/login");
    }
    next();
}