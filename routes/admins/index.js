const express=require("express");
const router=express.Router();

// import files
const adminRoute=require("./admin.js");
const adminAuthRoute=require("./adminAuth/adminAuth.js");

//admin
router.use("/",adminRoute);
// admin auth
router.use("/auth",adminAuthRoute);








module.exports=router;