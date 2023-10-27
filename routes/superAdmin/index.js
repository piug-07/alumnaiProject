const express=require("express");
const router=express.Router();

// import file
const superAdminAuthRoute=require("./superAdminAuth/superAdminAuth.js");
const superAdminRoute=require("./superAdmin.js");

router.use("/",superAdminRoute);
router.use("/auth",superAdminAuthRoute);


module.exports=router;


