const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

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

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"698578324ab4108be1e82f4a"}));  //this line adds the new key to each listing model,there is also other way to do it add each owner 1 by 1 to each listing object
    await Listing.insertMany(initData.data);
    console.log("Data was INitialized");
}

initDB();