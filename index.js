const express=require("express");
const path=require("path");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();

const port=process.env.PORT||80;
const app=express();
// database start
const mongoose=require("mongoose");
const DATABASE_URL=process.env.DATABASE_URL;
console.log(DATABASE_URL)
const connectdb=require("./database/database.js");
connectdb(DATABASE_URL);
// database end

// app.use(express.static("./public"));
app.use("/public",express.static("public"));
// app.use("/public",express.static("public"));


app.use(express.json());
app.use(cors());


// using routes
const homeRoute=require("./routes/index.js");
app.use("/",homeRoute);

app.listen(port,(error)=>{
    if(error){
        console.log("server not started");
    }else{
        console.log("server started at port "+port);
    }
})
