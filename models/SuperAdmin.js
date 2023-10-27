const mongoose=require("mongoose");

let SuperAdminSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    

},{collection:"superAdmin",timestamps:true});

module.exports=mongoose.model("SuperAdmin",SuperAdminSchema)