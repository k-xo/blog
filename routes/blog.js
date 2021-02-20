const express = require('express');
const Blog = require('../models/blog')
const router = express.Router();


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/login')
    }
    next()
};

const isAuthorized = (req, res, next) => {
    if (!req.user._id.equals(process.env.CREATOR_SECRET)) {
        res.redirect('/blogs')
    }
    next();
}


router.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/index', { blogs });
})


router.post('/', async (req, res) => {
    const blog = new Blog(req.body);
    blog.author = req.user_id;
    await blog.save();
    res.redirect('/blogs')
})


router.get('/new', isLoggedIn, isAuthorized, (req, res) => {
    res.render('blogs/new')
})

module.exports = router;