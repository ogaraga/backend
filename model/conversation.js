const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    conversation:{
        type: [],
    },
    senderId: String,
    receiverId: String
},{timestamps:true});

module.exports= mongoose.model('Message',conversationSchema)