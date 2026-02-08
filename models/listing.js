const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/coconut-tree-near-body-of-water-HfIex7qwTlI",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/coconut-tree-near-body-of-water-HfIex7qwTlI"
          : v,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
      
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

//post middleware for deleting all reviews if listing gets deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
