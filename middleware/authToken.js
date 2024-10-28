const JWT = require('jsonwebtoken');
require('dotenv').config();
module.exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.Access;
    try {
        if (!token) {
            res.status(404).json('JWT not found!');
        } else {
            await JWT.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
                if (err) {

                    throw new Error(err.message);
                } else {

                    req.user = decoded.user
                }
            });
            next()
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}
