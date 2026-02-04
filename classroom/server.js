const { name } = require("ejs");
const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

const sessionOptions={secret:"mysecretstring",resave:false,saveUninitialized:true};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session(sessionOptions));
app.use(flash());


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

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("success","user registered successfully")
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.render("page.ejs",{name: req.session.name, msg: req.flash("success")});  without using the [res.locals]
    res.locals.messages=req.flash("success");
    res.render("page.ejs",{name:req.session.name});
});

app.listen(8080,()=>{
    console.log("Server is listening to port: 8080");
})