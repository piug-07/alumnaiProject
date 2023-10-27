const router = require('express').Router();
const  verifyToken  = require('../../middleWare/verifyTokenUser');
const mongoose = require('mongoose')

const Post = require("../../models/Post");

const User = require("../../models/User");
// multer
const multer = require('multer')
// disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/postsImages/')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

//add these 2 lines to make sure the parsing functionality is passed on to access body
router.use(require('express').json());
router.use(require('express').urlencoded({ extended: true }));

// check verification function
function checkVerified(user) {// to be user before accessing all the main pages

    const { password, testResult, ...others } = user._doc;
    let Data = { ...others }
    // console.log(Data)
    // console.log(Data.verified)
    if (Data.verified == 1) {
        return 1;
    }
    return 0;
}



router.get("/", (req, res) => {// not required during the use times

    res.send("post route");
})








// show all the posts (entire feeds);
router.get("/showAllPosts", verifyToken, async (req, res) => {

    try {
        id = await req.user._id; // getting user id form the jwt encryption


        const post = await Post.find({postedBy:id}).populate({ path: "postedBy", model: "User", select: "name email username date imageUrl about" }).sort('-createdAt');
        if (!post) {
            res.status(200).json({ success: false, message: "post not found" });
        } else {



            res.status(200).json(post);
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }

})

// create post by user
router.post('/createpost', verifyToken, upload.single('photo'), async (req, res) => {
    // const{title,body}=req.body

    // if(!title||!body){
    //     res.status(422).json({error:"Add fields"})
    // }
    // console.log(req.user)
    // res.send("ok")

    const user = await User.findById(req.user._id);
    let verifiedAccount = checkVerified(user);
    if (verifiedAccount == 1) {
        var tempPath = req.file
        if (tempPath) {
            const post = new Post({
                title: req.body.title,
                body: req.body.body,
                photo: req.file.path.replace(/\\/g,"/"),
                postedBy: req.user._id,
                // username:req.body.username,
                // postType:req.body.postType
            })
            post.save().then(result => {
                res.json({ post: result })
            })
                .catch(err => {
                    console.log(err)
                })
        }else{
            const post = new Post({
                title: req.body.title,
                body: req.body.body,
                // photo: req.file.path,
                postedBy: req.user._id,
                // username:req.body.username,
                // postType:req.body.postType
            })
            post.save().then(result => {
                res.json({ post: result })
            })
                .catch(err => {
                    console.log(err)
                })
        }

    } else {
        res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
    }
    // console.log(verified)
    console.log(user);

    var username;
    // if(user.username){ // if no username at the sign in account
    //     username=user.username
    // }else{
    //     username=" ";
    // }


})
// show the posts posted by the user//           @ may be some error
router.get("/showMyPosts", verifyToken, async (req, res) => {
    try {
        id = await req.user._id; // getting id form the jwt encryption

        const userPost = await Post.find({}).populate({ path: "postedBy", model: "User", select: "name email username date imageUrl about" }).sort('-createdAt');;
        if (!userPost) {
            res.status(200).json({ success: false, message: "User post not found" });
        } else {



            res.status(200).json(userPost);
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
})

// Like a post
router.put('/like', verifyToken, async (req, res) => {
    let postId = req.body.postId;
    const postContent = await Post.find({_id:postId});
    if(!postContent[0].likes.includes(req.user._id)){
        Post.findByIdAndUpdate(postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).populate("comments.writer", "_id name")
            .populate("postedBy", "_id name username")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {
                    res.json(result);
                }
            })
    } else {
        return res.status(422).json({error: "User has already liked the post"})
    }
    
})



// unLike a post
router.put('/unlike', verifyToken, async (req, res) => {
    let postId = req.body.postId;
    const postContent = await Post.find({_id:postId});
    console.log(postContent);
    if(postContent[0].likes.includes(req.user._id)){
        Post.findByIdAndUpdate(postId, {
            $pull: { likes: req.user._id }
        }
        ,{
            new: true
        }).populate("comments.writer", "_id name")
            .populate("postedBy", "_id name username")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {
                    res.json(result)
                }
            })
    } else {
        return res.status(422).json({ error: "User has not liked this post" })
    }
    
})


//Comment on a post
router.put('/comment', verifyToken, (req, res) => {
    const comment = {
        // text:req.body.text,
        commentcontent: req.body.commentcontent,// comment content
        writer: req.user._id,// by the user
        postId: req.body.postId,// for post id
        // responseTo: req.body.responseTo
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.writer", "_id username imageUrl")
        .populate("postedBy", "_id name username")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                console.log(result);
                res.json(result)
            }
        })
})

// Delete a post
// router.delete('/deletepost/:postId',verifyToken,(req,res)=>{
//     Post.findOne({_id:req.params.postId})
//     .populate("postedBy","_id")
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err})
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//               post.remove()
//               .then(result=>{
//                   res.json({status:true,message:`${result._id} post has been deleted`})
//               }).catch(err=>{
//                   console.log(err)
//                   res.json({status:false,message:`Post Not deleted`})
//               })
//         }
//     })
// })

//Delete a comment
// router.delete('/comment',verifyToken,(req,res)=>{

//     Post.findByIdAndUpdate(req.body.postId,{
//         $pull:{comments:{_id:req.body.commentId}}
//     },{
//         new:true
//     })
//     .populate("comments.writer","_id name")
//     .populate("postedBy","_id name")
//     .exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }else{
//            // console.log(result);
//             res.json(result)
//         }
//     })
// })



module.exports = router;