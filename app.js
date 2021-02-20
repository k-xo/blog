if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const session = require('express-session')
const flash = require('connect-flash');
const User = require('./models/user');

//Requiring routes
const blogRoutes = require('./routes/blog')
const userRoutes = require('./routes/user')


//Configurations
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Session config
const sessionConfig = {
    name: 'session',
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

//Configuring Passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


//Connecting Mongo
const dbUrl = 'mongodb://localhost:27017/blog-site';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log('Database Connected');
});


//Routes
app.get('/', (req, res) => {
    res.send('This is the homepage')
})

app.use('/', userRoutes)
app.use('/blogs', blogRoutes)





app.listen(3000, () => {
    console.log('Listening on Port 3000')
})