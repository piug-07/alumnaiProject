const mongoose =require('mongoose')

const{ObjectId}=mongoose.Schema.Types
const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:false
    },
    body:{
        type:String,
        required:false
    },
    photo:{
        type:String,
        required:false
        // default:"no photo"
    },
    // postType:{
    //     type:String,
    //     enum:['text','image'],
    //     default:'text',
    //     required:false
    // },
    likes:[{type:ObjectId,ref:"User"}],
    unlikes:[{type:ObjectId,ref:"User"}],
    comments:[{
        // text:String,
        writer:{
            type:ObjectId,
            ref:'User'
        },
        postId:{
            type:ObjectId,
            ref:'Post'
        },
        // responseTo:{
        //     type:ObjectId,
        //     ref:'User'
        // },
        commentcontent:{
            type:String
        }
    }],
    username:{
        type:String,
        required:false
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports=mongoose.model('Post',postSchema)