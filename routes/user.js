const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)
            res.redirect('/blogs')
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/blogs')
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/blogs');
})


module.exports = router;