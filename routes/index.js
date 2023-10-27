const express = require("express");
const router = express.Router();

// dictionary page
// importing files.
const UserRoute = require("./User/index.js");
const AdminRoute = require("./admins");
const SuperAdminRoute = require("./superAdmin");

// adding routes to files
router.get("/", (req, res) => {
    res.send("Welcome to Alumnai website");
})
// user
router.use("/api/user", UserRoute)
// superAdmin
router.use("/api/superAdmin", SuperAdminRoute);
// auth
router.use("/api/admin", AdminRoute);

module.exports = router;