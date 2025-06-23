const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async(req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({error : 'Email and password are required'});
        }
        const user = await User.findOne({email});

        if (!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid credentials'});
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({token});
    }
    catch(err){
        console.error('Login error', err);
        res.status(500).json({error: 'Internal server error'
        });
    }
});

module.exports = router;