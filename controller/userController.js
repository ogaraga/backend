//importing user from users model
require('dotenv').config()
const User = require('../model/User');
const validate = require('validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const redisClient = require('../redis');
//Register routes to obtain rights to use our social media chat/network 
module.exports.register = async (req, res) => {
    const { username, email, phone, dob, password, password2, photos } = req.body;
    const user = await User.findOne({ email });
    let txt = /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    try {
        if (user) {
            res.status(400).json('This user already exists, please login!');
        }
        else if (validate.isEmpty(username) || validate.isEmpty(email) || validate.isEmpty(phone) || validate.isEmpty(dob) || validate.isEmpty(password) || validate.isEmpty(password2)) {
            res.status(400).json('All the fields must be filled!')
        }
        else if (!validate.isEmail(email)) {
            res.status(400).json('Entered email is invalid!')
        }
        else if (!validate.isDate(dob)) {
            res.status(400).json('Invalid date entered!');
        }

        else if (phone.length < 11 && !txt.test(phone)) {
            res.status(400).json('Invalid phone number.It must be of number character 11')
        }
        else if (password !== password2) {
            res.status(400).json('Password must match with confirmPassword!')
        }
        else if (password.length < 6 || password2.length < 6) {
            res.status(400).json('Either of the password is too short!')
        }
        else {
            //if all is correct go ahead to create users info/model and hashing the key(password)
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                email,
                phone,
                dob,
                photos,
                password: hashedPassword,
                password2: hashedPassword
            });
            await newUser.save();
            res.status(201).json("User registration successful!")
        }
    } catch (error) {
        res.status(500).json(error.message);
        process.exit(1);
    }

}

//login routes to access our social media chat/network
module.exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10)
        const cachedEmail = await redisClient.get(`Email:${email,password}`);
        let response = null;
        if (cachedEmail) {
            response = {
                mgs: 'Email Found!',
                status: '200',                
            }
            res.status(200).json(JSON.parse(response));            
        }
        else {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json('This user does not exist, please create an account!');
            }

            else {
                const passwordIsCorrect = await bcrypt.compare(password, user.password);
                if (!passwordIsCorrect) {
                    res.status(400).json('Password is incorrect, try again or reset your password!')
                } else {
                    
                    const token = await JWT.sign({ id: user._id, email: user }, process.env.AUTH_SECRET, { expiresIn: '30m' });
                    req.session.token = token;
                    res.cookie('Access', token, { httpOnly: true })
                    await redisClient.set(`Email:${email, password}`, JSON.stringify({ token: token, id: req.session.id, _id: user._id }));
                    res.status(200).json({ token: token, id: req.session.id, _id: user._id })
                }
            }
        }
    } catch (error) {
        res.status(500).json(error.message)
        process.exit(1)
    }
}
module.exports.updateUser = async (req, res) => {
    try {
        const { token } = req.params;
        const { email, password, phone, dob, picture } = req.body;
        let txt = /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json('This user is not in the database; you are now being redirected to create an account');
        }
        else if (phone.length < 11 && txt.test(phone)) {
            res.status(400).json('Phone number is invalid!')
        }
        else if (password.length < 6) {
            res.status(400).json('Password must be greater than 5 characters')
        }
        else if (!token || !dob) {
            res.status(400).json('token not valid or empty dob!')
        } else {
            req.session.token = token;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.findOneAndUpdate({ email }, {
                email,
                phone,
                dob,
                picture,
                password: hashedPassword
            });
            await newUser.save();
            res.status(200).json({ token: req.session.token })
        }

    } catch (error) {
        res.status(500).json(error)
        process.exit(1);
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const { _id, token } = req.params;
        req.session.destroy();
        res.clearCookie('Access');
        res.clearCookie(process.env.SESSION_NAME)
        const user = await User.findByIdAndDelete({ _id });

        if (!user) {
            res.status(400).json('You are not authorized to perform this action!')
        }

        else {
            res.status(200).json(`User with Id: ${_id}, and token: ${token}, deleted!`)

        }
    } catch (error) {
        res.status(500).json(error.message)
    }

}
module.exports.profile = async (req, res) => {

    try {
        const { _id } = req.params;
        const user = await User.findOne({ email });
        // req.session.id = true;
        // req.session.id = id;
        res.status(200).json({ id: req.session.id, _id: user._id })
    } catch (error) {
        res.status(500).json(error.message);
    }
}
module.exports.homeProfile = (req, res) => {
    try {
        const { token } = req.params;
        req.session.token = token;
        res.status(200).json({ token: req.session.token, id: req.session.id })
    } catch (error) {
        res.status(500).json(error.message)
    }
}
module.exports.logOut = (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('Access')
        res.clearCookie(process.env.SESSION_NAME);
        res.status(200).json('You are logged out!')
    } catch (error) {
        res.status(500).json(error.message)
        process.exit(1);
    }
} 