require('dotenv').config()
const router = require('express').Router();
const { login, register, deleteUser, updateUser, profile, logOut, homeProfile} = require('../controller/userController')
const { message } = require('../controller/messageController')
const { conversion } = require('../controller/conversationController');
const { forgot } = require('../controller/forgotController');
const authToken = require('../middleware/authToken');
const authSession = require('../middleware/authSession');
const {getNews} = require('../controller/getNewsController');
const { contact } = require('../controller/contactUsController');
contact

//login route
router.post('/api_v1/signin', login)

//register or joinnow route
router.post('/api_v1/joinnow', register)

//user update 
router.put('/api_v1/resetpass/:email/:token', updateUser)

//message routes
router.post('/api_v1/message', message).put('/api_v1/message', message).delete('/api_v1/conversion/:_id', authSession.verifySession, authToken.verifyToken, message)

//forgotpassword route for user
router.post('/api_v1/forgot', forgot); 

//social profile route  
router.get('/api_v1/profile/:_id/:token', authSession.verifySession, authToken.verifyToken, profile).delete('/api_v1/profile/:_id/:token',deleteUser)

// profileHome route
router.get('/api_v1/profile/home/:_id/:token', authSession.verifySession, authToken.verifyToken, homeProfile)
//conversation routes or all users v1a id
router.post('/api_v1/conversion/:_id', conversion).put('/api_v1/conversion/:_id', conversion).delete('/api_v1/conversion/:_id', authSession.verifySession, authToken.verifyToken, conversion)

//logout route
router.get('/api_v1/logout', authSession.verifySession, authToken.verifyToken, logOut)
//News Route
router.get('/api_v1/profile/news/:_id/:token',authSession.verifySession,authToken.verifyToken, getNews)
//contact us route
router.post('/api_v1/contact', contact)
module.exports = router;     
