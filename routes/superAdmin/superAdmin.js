const express=require("express");
const  verifyToken = require("../../middleWare/verifyTokenSuperAdmin");
const router=express.Router();
const SuperAdmin=require("../../models/SuperAdmin.js");
const User=require("../../models/User.js");
const Admin=require("../../models/Admin.js");
const bcrypt=require("bcrypt");

// use verifyTokenAndAuthorise when user id is needed for the operation ex crud
// use verifyToken for only simple acess with jwt token

function checkVerified(superAdmin) {// to be user before accessing all the main pages

    const { password, testResult, ...others } = superAdmin._doc;
    let Data = { ...others }
    // console.log(Data)
    // console.log(Data.verified)
    if (Data.verified == 1) {
        return 1;
    }
    return 0;
}


router.get("/",verifyToken,(req,res)=>{
    res.send("this is SuperAdmin page");
});

router.get("/testPage", verifyToken, async (req, res) => {
    // show user data
    try {
        id = await req.user._id; // getting id form the jwt encryption

        const user = await SuperAdmin.findById(id);
        if (!user) {
            res.status(200).json({ success: false, message: "user not found" });
        } else {

            const verifiedAccount = checkVerified(user);
            // console.log(checkVerified(user))
            if (verifiedAccount == 1) {
                const { password, testResult, ...others } = user._doc;
                res.status(200).json({ ...others });
            }else{
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }

        }
    } catch (e) {

        res.status(500).json({ success: false, message: "server data not found" });
    }
});


// show superadmin profile
router.get("/myprofile",verifyToken,async (req,res)=>{
    // show user data
    try{
        id=await req.user._id; 
        
       const user=await SuperAdmin.findById(id);
       if(!user){
           res.status(200).json({ success: false, message: "super admin not found" });
       }else{
           
          
           const {password,testResult,...others}=user._doc;
           res.status(200).json({...others});
       }
        }catch (e){
            
            res.status(500).json({ success: false, message: "server data not found" });
        }
});
// show superadmin profile end


//------------------------------------------------------- Users Activity Section------------------------------------------------
// Code to list of all users
router.get('/listUsers', verifyToken, async (req, res) => {

    try {
        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) { // 1 for vrified
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
router.get("/findUser/:id", verifyToken,async (req, res) => {// id is user id
    try {
        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) {
                const userId = req.params.id;
                
                const user = await User.findById(userId);
                
                if (!user) {
                    res.status(200).json({ success:flase,message: "user not found" });
                }else{
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
router.post("/verifyUser/:id", verifyToken,async (req, res) => {// id is user id
    try {

        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) {
                const userId = req.params.id;
                //take verify 1 or 0 (1 for verified 0 for not verified)
                let verifiedAccountUser=req.body.verify;
                
                
                const user = await User.findById(userId);
                
                if (!user) {
                    res.status(200).json({ success:flase,message: "user not found" });
                }else{
                    
                    user.verified=verifiedAccountUser;
                   

                    res.status(200).json({success:true,message:`user account verified set to ${verifiedAccountUser}`});
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

// verify or reject user end
//--------------------------------------------------------------User activity section end-----------------------------------------







//------------------------------------------------------- Admin Activity Section------------------------------------------------
// allow create admins by super admin
router.post("/createAdmin",async(req,res)=>{
    
    Admin.findOne({email:req.body.email}).then(async(user)=>{
        if(user){
            res.status(200).json({ success: true, message: "user exists" });
            // res.status(302).redirect("/api/auth/register");
        }else{
            const salt=await bcrypt.genSalt(10);
            const hashedPass=await bcrypt.hash(req.body.password,salt);
            Admin.create({
                name:req.body.name,
                email:req.body.email,
                password:hashedPass,
                verified:"0",  // by default 0 for not verified account
                
                
            }).then((data)=>{
                res.status(200).json({ success: true, message: "Admin Created Success" }); // redirect here after the registration to login page
                console.log("Admin Created");
                console.log(data.createdAt);
            }).catch((error)=>{
                res.status(500).json(error);
                console.log(error);
            })
        }
    })
});

// Code to list of all admins
router.get('/listAdmins', verifyToken, async (req, res) => {

    try {
        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "super admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) { // 1 for verifies
                const adminList = await Admin.find();
                res.status(200).json(adminList);
            } else {
                res.status(500).json({ success: false, message: "Account not Verified please wait till verification" });
            }
        }

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// list of all admin end
// show particular admin
router.get("/findAdmins/:id", verifyToken,async (req, res) => {// id is user id
    try {
        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "super admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) {
                const adminId = req.params.id;
                
                const user = await Admin.findById(adminId);
                
                if (!user) {
                    res.status(200).json({ success:flase,message: "admin not found" });
                }else{
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
// show particular admin end
// verify or reject admin
router.post("/verifyAdmin/:id", verifyToken,async (req, res) => {// id is user id
    try {

        let id = await req.user._id;
        let superAdmin = await SuperAdmin.findById(id);
        if (!superAdmin) {
            res.status(200).json({ success: false, message: "admin not found" });
        } else {
            let verifiedAccount = checkVerified(superAdmin);
            if (verifiedAccount == 0) {
                const adminId = req.params.id;
                //take verify 1 or 0 (1 for verified 0 for not verified)
                let verifiedAccountAdmin=req.body.verify;
                
                
                const user = await Admin.findById(adminId);
                
                if (!user) {
                    res.status(200).json({ success:flase,message: "user not found" });
                }else{
                    
                    user.verified=verifiedAccountAdmin;
                   

                    res.status(200).json({success:true,message:`user account verified set to ${verifiedAccountAdmin}`});
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

// verify or reject admin end
//--------------------------------------------------------------Admin activity section end-----------------------------------------









module.exports=router;