const express = require("express");
const verifyToken = require("../../middleWare/verifyTokenAdmin");
const router = express.Router();
const Admin = require("../../models/Admin.js");
const User = require("../../models/User.js");
const Post = require("../../models/Post");
const bcrypt = require("bcrypt");
// use verifyTokenAndAuthorise when user id is needed for the operation ex crud
// use verifyToken for only simple acess with jwt token
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


router.get("/", verifyToken, (req, res) => {

    res.send("this is Admin page");
});

// show admin profile
router.get("/myprofile", verifyToken, async (req, res) => {
    // show user data
    try {
        id = await req.user._id;

        const user = await Admin.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {


            const { password, testResult, ...others } = user._doc;
            res.status(200).json({ ...others });
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
});
// show admin profile end
















// Code to list of all users
router.get('/listUsers', verifyToken, async (req, res) => {

    try {
        let id = await req.user._id;
        let admin = await Admin.findById(id);
        if (!admin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(admin);
            if (verifiedAccount == 0) { // 1 for verified account 
                const userList = await User.find();
                res.status(200).json(userList);
            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }
        }

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// list of all users end
// show particular user
router.get("/findUser/:id", verifyToken, async (req, res) => {// id is user id
    try {
        let id = await req.user._id;
        let admin = await Admin.findById(id);
        if (!admin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(admin);
            if (verifiedAccount == 0) {
                const userId = req.params.id;

                const user = await User.findById(userId);

                if (!user) {
                    res.status(200).json({ success: flase, message: "user not found" });
                } else {
                    res.status(200).json(user);
                }

            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }
        }

    }
    catch (error) {
        res.status(500).json({ success: false, message: "server data not found" });

    }
})
// show particular user end
// verify or reject user
router.put("/verifyUser/:id", verifyToken, async (req, res) => {// id is user id
    try {

        let id = await req.user._id;
        let admin = await Admin.findById(id);
        if (!admin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(admin);
            if (verifiedAccount == 0) {
                const userId = req.params.id;
                //take verify 1 or 0 (1 for verified 0 for not verified)
                let verifiedAccountUser = req.body.verify;
                console.log(verifiedAccountUser)


                // const user = await User.findById(userId);

                // if (!user) {
                //     res.status(200).json({ success:flase,message: "user not found" });
                // }
                // else{

                //     // user.verified=verifiedAccountUser;
                let Updateuser = await User.findByIdAndUpdate(userId, {
                    verified: verifiedAccountUser
                }, {
                    new: true
                })


                res.status(200).json({ success: true, message: `user account verified set to ${verifiedAccountUser}`, result: Updateuser });
                // }

            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }
        }

    }
    catch (error) {
        res.status(500).json({ success: false, message: "server data not found" });

    }
})

// verify or reject user end


router.get("/testPage", verifyToken, async (req, res) => {
    // show user data
    try {
        id = await req.user._id; // getting id form the jwt encryption

        const user = await Admin.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {

            const verifiedAccount = checkVerified(user);
            // console.log(checkVerified(user))
            if (verifiedAccount == 1) {
                const { password, testResult, ...others } = user._doc;
                res.status(200).json({ ...others });
            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }

        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
});



// download user files
router.get('/download/:id/fileToDownload/:fileName', verifyToken, async (req, res) => {
    // show user data
    try {
        let id = await req.user._id; // getting id form the jwt encryption
        let userId = await req.params.id;
        let fileName = await req.params.fileName;
        const user = await Admin.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {
            console.log("hello")
            // const verifiedAccount = checkVerified(user);
            // console.log(checkVerified(user))
            // if (verifiedAccount == 0) { // 0 means admin account not verified make 0 for testing purpose
            getUserFiles(userId, fileName, req, res);//for getting the file to download by sending the userId and fileNameVariable
            // } else {
            //     res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            // }

        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }

})




// for getting the file to download by sending the userId and fileNameVariable (for download route)
function getUserFiles(id, fileName, req, res) {
    // const user = await User.find({});
    User.findById(id).then((alumnai) => {

        if (!alumnai) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {

            const verifiedAccount = checkVerified(alumnai);
            // console.log(checkVerified(alumnai))
            if (verifiedAccount == 1) {
                let fileToDownload = alumnai["verificationDoc"][fileName][0].path;
                // res.send(fileToDownload)
                res.status(200).download(fileToDownload);

            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }

        }
    })


}



// show the all the posts posted by the users//         
router.get("/showAllPosts/:id", verifyToken, async (req, res) => {
    try {
        let id = await req.user._id;
        // const id = req.params.userId;
        // let admin = await Admin.findById(id);
        const allPosts = await Post.find({  id }).populate({ path: "postedBy", model: "User", select: "name email username date imageUrl about" }).sort('-createdAt');;
        if (!allPosts) {
            res.status(200).json({ success: false, message: "User post not found" });
        } else {
            res.status(200).json(allPosts);
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
})






//Delete a post
router.delete('/deletepost/:postId', verifyToken, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }

            post.remove()
                .then(result => {
                    res.json({ status: true, message: `${result._id} post has been deleted` })
                }).catch(err => {
                    console.log(err)
                    res.json({ status: false, message: `Post Not deleted` })
                })

        })
})
















// download files end

module.exports = router