
module.exports.getNews =(req, res)=>{
    try {
        const { token } = req.params;
        req.session.token = token;
        res.status(200).json({ token: req.session.token, id: req.session.id })
    } catch (error) {
        res.status(500).json(error.message)
    }
}