const bcrypt = require('bcrypt');
const User = require('../models/userModels');

let message = null;

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (e) {
        console.log(err.message);
    }
}

const loadSignup = (req, res) => {
    try {

        if (req.session.user_id) {
            res.redirect('/');
        } else {
            res.render('signup', { message: null, action: "/signup" });
        }

    } catch (e) {
        console.log(e.message);
    }
}

const createUser = async (req, res) => {

    try {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ username: username });

        if (userData) {
            message = "This username already exists";
            res.render("signup", { message, action: "/signup" });
        } else {
            const hashPass = await securePassword(password);
            const newUser = new User({
                username: username,
                email: email,
                password: hashPass,
                isAdmin: false
            })
            const userData = await newUser.save();
            res.redirect('/login');
        }

    } catch (err) {
        console.log(err);
    }

}

const loadLogin = async (req, res) => {
    try {
        if (req.session.user_id) {
            res.redirect('/');
        } else {
            res.render('login', { message: null })
        }
    } catch (err) {
        console.log(err);
    }
}


const verifyLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userData = await User.findOne({ username: username });

    if (userData) {
        const passMatch = await bcrypt.compare(password, userData.password)

        if (passMatch) {
            if (userData.access == true) {

                req.session.user_id = userData._id;

                if (userData.isAdmin) {
                    req.session.admin_id = userData._id;
                }

                res.redirect('/');
            }
            else {
                res.render('login', { message: "Access denied" })
            }
        } else {
            res.render('login', { message: "password is incorrect" })
        }
    } else {
        res.render('login', { message: "username or password is incorrect" })
    }
}


const loadHome = async (req, res) => {
    if (req.session.user_id) {
        const userData = await User.findOne({ _id: req.session.user_id }, { username: 1, isAdmin: 1 });
        res.render('home', { username: userData.username, isAdmin: userData.isAdmin });
    } else {
        res.redirect('/login');
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.user_id = null;
        req.session.admin_id = null;
        res.clearCookie('user_id');
        res.redirect('/login');
    } catch (err) {
        console.log(err.message);
    }
}


module.exports = {
    loadHome,
    createUser,
    loadSignup,
    loadLogin,
    verifyLogin,
    userLogout,
    securePassword
}