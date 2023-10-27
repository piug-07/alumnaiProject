const express = require("express");
const verifyToken = require("../../middleWare/verifyTokenUser");
const router = express.Router();
const User = require("../../models/User.js");
const bcrypt = require("bcrypt");
// use verifyTokenAndAuthorise when user id is needed for the operation ex crud
// use verifyToken for only simple acess with jwt token


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


// multer
const multer = require('multer')
// for the documents upload
// disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/verificationDocs')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
        // console.log(file)
    }
})

const upload = multer({ storage: storage })
var multipleUploads = upload.fields([{ name: "file1", maxCount: 1 }, { name: "file2", maxCount: 1 }, { name: "file3", maxCount: 1 }]); // only three files can be uploaded with names set as file1, file2, file3

// for the user profile image upload
const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/profileImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const profileImageUpload = multer({ storage: profileImageStorage });
// multer end


router.get("/", verifyToken, (req, res) => {
    res.send("this is user page");
});

// upload files for verification
router.post("/upload/verification", verifyToken, multipleUploads, (req, res) => {
    id = req.user._id;
    let files;
    if (req.files) {
        files = req.files;
        // console.log(files)
        // console.log(typeof(files))
        // console.log(req.files.file1[0].path);
    }

    User.findByIdAndUpdate(id, {
        verificationDoc: files,
    }).then((user) => {
        // console.log(user.additionalDetails['hello']);
        // res.send(user);
        res.status(200).json({ success: true, message: "files uploaded Success wait for verification" });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: "user profile not updated" });

    });


});
// upload files for verification end





// show user profile
router.get("/myprofile", verifyToken, async (req, res) => {
    // show user data
    try {
        id = await req.user._id;

        const user = await User.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {


            const { password, ...others } = user._doc;
            res.status(200).json({ ...others });
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
});
// show user profile end





// update user profile info
router.put("/myprofile", verifyToken, profileImageUpload.single('imageUrl'), async (req, res) => {

    id = req.user._id;


    User.findByIdAndUpdate(id, {
        name: req.body.name,
        username: req.body.username,
        imageUrl: req.file.path,  // for profile pic of the user
        // college details (update after the user is created)
        rollNumber: req.body.rollNumber,
        batchOf: req.body.batchOf,
        department: req.body.department,
        admissionNo: req.body.admissionNo,
        phoneNumber: req.body.phoneNumber,
        about:req.body.about,
        company:req.body.company,
        sector:req.body.sector

    }).then((user) => {

        res.status(200).json({ success: true, message: "user profile updated Success" });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: "user profile not updated" });

    });


});
// update user profile info end




// show all the users whith the same department the user has
router.get("/showMyDepartmentStudents", verifyToken, async (req, res) => {
    try {
        id = await req.user._id;

        const user = await User.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {
            // check the user department 
            let userDepartment=user.department;
            if(!userDepartment){
                res.status(200).json({ success: false, message: "no batch found for the user please add user batch" });
            }else{
                // if there is department
                let usersWithSameDepartment=await User.find({department:userDepartment});
                // list all the users with the same department
                res.status(200).json({usersWithSameDepartment})
            }


            
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
})


// show all the users with the same batch
router.get("/showAllTheUsersWithSameBatch", verifyToken, async (req, res) => {
    try {
        id = await req.user._id;

        const user = await User.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {
            // check the user department 
            let userBatch=user.batchOf;
            if(!userBatch){
                res.status(200).json({ success: false, message: "no batch found for the user please add user batch" });
            }else{
                // if there is department
                let usersWithSameBatch=await User.find({batchOf:userBatch});
                // list all the users with the same department
                res.status(200).json({usersWithSameBatch})
            }


            
        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
})




// left
// search user api











router.get("/testPage", verifyToken, async (req, res) => {
    // show user data
    try {
        id = await req.user._id; // getting id form the jwt encryption

        const user = await User.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {

            const verifiedAccount = checkVerified(user);
            // console.log(checkVerified(user))
            if (verifiedAccount == 1) {
                res.status(300).json({ success: false, message: "Account not Verified please wait till verification redirect to /api/user/upload/verification" });
                // res.status(302).redirect("/api/user/upload/verification");
                // const { password, testResult, ...others } = user._doc;
                // res.status(200).json({ ...others });
            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }

        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
});


















//@test code
// router.get("/files", verifyToken, async (req, res) => {
//     // show user data
//     try {
//         id = await req.user._id; // getting id form the jwt encryption

//         const user = await User.findById(id);
//         if (!user) {
//             res.status(200).json({ success: false, message: "user not found" });
//         } else {

//             const verifiedAccount = checkVerified(user);
//             // console.log(checkVerified(user))
//             if (verifiedAccount == 0) {
//                 res.send(user["verificationDoc"]);
//                 // const { password, testResult, ...others } = user._doc;
//                 // res.status(200).json({ ...others });
//             } else {
//                 res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
//             }

//         }
//     } catch (e) {

//         res.status(500).json({ success: false, message: "server data not found" });
//     }
// });
// @testCode end


module.exports = router;