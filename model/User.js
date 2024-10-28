const mongoose = require('mongoose');
const validate = require('validator')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        minLength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    dob: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minLength: [6, 'Password must be of length 6 characters long'],
        required: true
    },
    password2: {
        type: String,
        minLength: [6, 'Password must be of length 6 characters long'],
        required: true
    },
    photos: {
        type: String,
    }
}, { timestamp: true });
module.exports = mongoose.model('User', userSchema);