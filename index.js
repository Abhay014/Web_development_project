// requiring env file for safety
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


// for security using sanitize 
const mongoSanitize = require('express-mongo-sanitize');
// for security
const helmet = require('helmet');

//requiring npm pakages and files

const express = require("express");
const path = require('path');
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session  = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./modules/user');


//requring campground router and review router and user
const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/users');

// connecting mongoose with mongodb

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//checking for conformation of connectivity for database

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:****************************************************")
);
db.once("open", () => {
    console.log("database connected!!")
});




// making server up and running 

const app = express();

//using and seting few things

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));     

// using mongo sanitize for security
app.use(mongoSanitize());

// using session for cookies and flash
const sessionConfig = {
    name:'session',
    secret: "thisisasecret",
    //secure: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

// for helmet
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );

// using passport for authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error= req.flash('error');
    next();
});

// using embedded javascript for views folder 
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));


// adding campground router and review router in index.js
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);
app.use('/', userRoute);

// using ejs-mate in place of ejs

app.engine("ejs", ejsMate);

app.get('/', (req, res) => {
    res.render('home.ejs')
})




// error handling for all requests
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

// error handling

app.use((err, req, res, next) => {
    const { statusCode =500 } = err;
    if (!err.message) err.message = 'oh no, something went wrong!';
    res.status(statusCode).render("error",{err});

})






// lisenting from server

app.listen(3000, () => {
    console.log("we are listening now")
})









