const express=require("express");
const app=express();
const session=require("express-session");

const sessionOptions={secret:"mysecretstring",resave:false,saveUninitialized:true};

app.use(session(sessionOptions));


// app.get("/test",(req,res)=>{
//     res.send("Test Succesfull");
// })

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`You sent request ${req.session.count} times`);  //in stateless protocol the res remains same for same req,but in stateful protocol the res cchanges even if the req remains same[this is statefull protocol with every req the res]
// });

app.listen(8080,()=>{
    console.log("Server is listening to port: 8080");
})