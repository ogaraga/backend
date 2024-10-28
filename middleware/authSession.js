
module.exports.verifySession = (req, res, next)=>{    
    if(req.session.id || req.session.token){
        next()
    }else{
        res.redirect('/api_v1/signin') 
    }
}; 