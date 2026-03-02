const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    wishlist:[{
        type:Schema.Types.ObjectId,
        ref:"Listing",
    }],
});

userSchema.plugin(passportLocalMongoose);  // added this so that username,hashed password,salt is added automatically

module.exports= mongoose.model("User",userSchema);