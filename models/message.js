const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//MAKE AN INSTANCE OF A CLASS MODEL

const MessageSchema = new Schema({
    fullName: {
        type: String,
    },

    email: {
        type: String,
    },

    message: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now()
    },
});



//EXPORT THE MODEL CLASS
module.exports = mongoose.model('messages', MessageSchema);