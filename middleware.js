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