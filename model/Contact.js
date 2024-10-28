const mongoose = require('mongoose');
const { trim } = require('validator');

const contactSchema = new mongoose.Schema({
    username:{
        type: String,
        trim: true,
        minLength: 3
    },
    email:{
        type: String,
        trim: true,       
    },
    subject:{
        type: String,
        trim: true
    },
    message:{
        type: String,
        trim: true,
        minLength: 20
    },
},{timestamps: true})

module.exports = mongoose.model('Contact', contactSchema)