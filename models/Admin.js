const mongoose=require("mongoose");

let AdminSchema=new mongoose.Schema({
    
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
    verified:{
        type:String,
        required:true,
    }

},{collection:"admin",timestamps:true});

module.exports=mongoose.model("Admin",AdminSchema)