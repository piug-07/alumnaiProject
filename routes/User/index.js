const express=require("express");
const router=express.Router();


// import files
const userRoute=require("./user.js");
const userAuthRoute=require("./userAuth/userAuth.js");
// user post route
const userPostRoute=require("./post.js");

// using the files to route
router.use("/",userRoute);
router.use("/auth",userAuthRoute);
// user posts route
router.use("/posts",userPostRoute);

module.exports=router;