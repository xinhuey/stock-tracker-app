const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer')){
        return res.status(401).json({error: 'Unauthorised'
        });
    }
    const token = auth.aplit(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload.id;
        next();
    } catch(err){
        return res.status(401).json({error: 'Unauthorised'
        });
    }
};