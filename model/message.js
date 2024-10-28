const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{
        type: String,
        required:true,
    },
    senderId: String,
    receiverId: String
},{timestamps:true});

module.exports= mongoose.model('Message',messageSchema)