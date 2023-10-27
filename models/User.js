const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    // auth details
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: false,
    },
    company: {
        type: String,
        required: false
    },
    sector: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },

    // image of user
    imageUrl: {
        type: String,
        required: false
    },
    // verification related details
    verified: {// 1 if verified else 0 not verified
        type: String,
        required: true,
    },
    verificationDoc: {
        type: Object,
        required: false
    },
    // college details 
    rollNumber: {// college roll number
        type: String,
        required: false,
    },
    batchOf: {// batch of
        type: String,
        required: false
    },
    department: {// department name
        type: String,
        required: false
    },
    admissionNo: {// admission number
        type: String,
        required: false,
    }

}, { collection: "user", timestamps: true });

module.exports = mongoose.model("User", userSchema)