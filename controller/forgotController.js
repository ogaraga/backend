require('dotenv').config();
const User = require("../model/User");
const JWT =require('jsonwebtoken');
const nodemailer = require('nodemailer');
//send reset link to user for password reset

module.exports.forgot = async (req, res)=>{
    const {email} = req.body;
    const user =  await User.findOne({email});
    try {
        if(!user || email === ''){
        res.status(404).json('This user does not exist!');
        }
        
        else{
        const token = await JWT.sign({_id: user._id, email: user.email}, process.env.AUTH_SECRET,{expiresIn: '30m'});
        const resetLink = `http://localhost:3000/resetpass/${user.email}/${token}`;
        
        //send resetlink to mailbox
        const transporter = nodemailer.createTransport({
            service: process.env.HOST,
            auth:{
                user: process.env.USER,
                pass: process.env.PASS 
            }
        });
        const mailOptions={
            from: process.env.USER,
            to: user.email,
            subject: `Email reset response from ${process.env.USER}`,
            text: `Dear ${user.username},
            You requested for password reset link. Kindly click or copy the link below to reset your password, etc: ${resetLink} . Thank you.`
        }
        transporter.sendMail(mailOptions,(err, mailInfo)=>{
            if(err){
                res.status(400).json(err.message)
            }
            else{
                req.session.token = token
                req.session.email = user.email;
            res.status(200).json({token:req.session.token, email:req.session.email})}
        })}
    } catch (error) {
        res.status(500).json(error.message)
        process.exit(1)
    }
    
}