const User = require('../modules/user');


// fuction of routes for registration form

module.exports.renderRegister =  (req, res) => {
    res.render('users/register');
}

// fuction of routes for registration 

module.exports.register =async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=> {
            if (err) return next(err);
            req.flash('success', 'Welcome to yelp-camp!!');
            res.redirect('/campgrounds');
        })
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/register');
        }   
}



// fuction of routes for logging a user in (form)

module.exports.renderLogin =(req, res) => {
    res.render('users/login');
    
}
// fuction of routes for logging a user in
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// fuction for logout of a user
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success','Goodbye!!')
    res.redirect('/campgrounds');
}
