const mongoose = require("mongoose");
const Review = require("./reviews");
const { required } = require("joi");
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
  images: [
    {
      filename: String,
      url: String,
    },
  ],
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
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'] // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number]
    }
  }
});

// Pre-save hook to ensure consistency between image and images
listingSchema.pre('save', async function() {
  // If images array exists and has items, ensure image is set to first image
  if(this.images && this.images.length > 0 && (!this.image || !this.image.url)) {
    this.image = {
      filename: this.images[0].filename || 'listingimage',
      url: this.images[0].url
    };
  }
  // If image exists but images is empty, populate images with the image
  if(this.image && this.image.url && (!this.images || this.images.length === 0)) {
    this.images = [{
      filename: this.image.filename || 'listingimage',
      url: this.image.url
    }];
  }
});

//post middleware for deleting all reviews if listing gets deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
