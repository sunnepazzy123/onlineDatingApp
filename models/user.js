const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    facebook: {
        type: String,
    },

    google: {
        type: String,
    },

    firstName: {
        type: String,
    },

    lastName: {
        type:String,
    },

    fullName: {
        type: String
    },

    email: {
        type:String,
    },

    password: {
        type:String,
    },

    image: {
        type:String,
    },

    city: {
        type:String,
    },

    country: {
        type:String,
    },

    online: {
        type: Boolean,
        default: false
    },

    wallet: {
        type: Number,
        default: 0
    },

});

module.exports = mongoose.model("User", userSchema);