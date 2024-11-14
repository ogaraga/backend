const Contact = require("../model/Contact");
const validate = require('validator');
const User = require("../model/User");
const nodemailer = require('nodemailer');
require('dotenv').config();
const redisClient = require('../redis');


// set up contact us form route

module.exports.contact = async (req, res) => {
    try {
        const { username, email, subject, message } = req.body;
        const cachedEmail = await redisClient.get(`Email:${email}`);
        let response = null;
        if (cachedEmail) {
            response = {
                mgs: 'Email Found!',
                status: '200',
            }
            res.status(200).json(response);
        } else {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json('Please create an account before you can contact us')
            } else {
                await redisClient.set(`Email:${email}`, JSON.stringify(user));
                if (validate.isEmpty(username) || validate.isEmpty(email) || validate.isEmpty(subject) || validate.isEmpty(message)) {
                    res.status(400).json('All fields are required!')
                } else if (username.length < 3 || subject.length < 6 || message.length < 20) {
                    res.status('Some fields are too short')
                } else if (!validate.isEmail(email)) {
                    res.status(400).json('Invalid email entered!')
                }
                else {
                    const newUser = await Contact.create({
                        username,
                        subject,
                        message
                    });
                    await newUser.save();
                    const transporter = nodemailer.createTransport({
                        service: process.env.HOST,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASS
                        }
                    });
                    const mailOptions = {
                        from: `${email}`,
                        to: process.env.USER,
                        subject: `${subject}`,
                        text: `${message}.`
                    }
                    transporter.sendMail(mailOptions, async (err, mailInfo) => {
                        if (err) {
                            res.status(400).json(err.message)
                        }
                        else {
                            await redisClient.set(`Email:${email}`, JSON.stringify('Your message has been sent!'))
                            res.status(200).json('Your message has been sent!')
                        }
                    });
                }
            }


        }
    } catch (error) {
        res.status(500).json(error.message)
        process.exit(1);
    }
}
