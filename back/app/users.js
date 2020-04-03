const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    console.log(req.body);
    try {
        user.generateToken();
        console.log(user);
        await user.save();
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
        return res.status(400).send({error: "Username or password not correct"});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch) {
        return res.status(400).send({error: "Username or password not correct"});
    }

    user.generateToken();
    await user.save();
    return res.send(user);
});


router.delete('/sessions', async(req, res) => {
    const success = {message: 'Success'};

    try{
        const token = req.get('Authorization').split(' ')[1];
        if(!token) return res.send(success);
        const user = await User.findOne({token});
        if(!user) return res.send(success);
        user.generateToken();
        await user.save();
        return res.send(success);
    } catch(e) {
        return res.send(success);
    }

});

module.exports = router;
