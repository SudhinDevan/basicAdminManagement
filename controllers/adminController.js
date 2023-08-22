const userModel = require('../models/userModels');
const { securePassword } = require('./userController')

const adminHome = async (req, res) => {
    try {

        let search = '';
        if (req.query.search) {
            search = req.query.search;
            console.log(search);
        }

        const users = await userModel.find({
            isAdmin: false,
            $or: [
                { username: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ]
        });


        res.render('adminHome', { users });

    } catch (err) {
        console.log(err.message);
    }
}

const loadCreateUser = async (req, res) => {
    try {
        res.render('signup', { message: null, action: "/admin/create" })
    } catch (err) {
        console.log(err.message);
    }
}

const createUser = async (req, res) => {
    try {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const userData = await userModel.findOne({ username: username });

        if (userData) {
            message = "This username already exists";
            res.render("signup", { message, action: "/admin/create" });
        } else {
            const hashPass = await securePassword(password);
            const newUser = new userModel({
                username: username,
                email: email,
                password: hashPass,
                isAdmin: false
            })
            const userData = await newUser.save();
            res.redirect('/admin/home');
        }

    } catch (err) {
        console.log(err);
    }
}

const loadEditUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userDetails = await userModel.findById({ _id: id });
        if (userDetails) {
            res.render('editUser', { message: null, user: userDetails });
        } else {
            res.redirect('/admin/home');
        }

    } catch (err) {
        console.log(err.message);
    }
}

const editUser = async (req, res) => {
    try {

        const id = req.body._id;
        const username = req.body.username;
        const email = req.body.email;
        const status = req.body.access;

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { username: username, email: email, access: status } });
        res.redirect('/admin/home');

    } catch (err) {
        console.log(err.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;
        await userModel.deleteOne({ _id: id });
        res.redirect("/admin/home");
    } catch (err) {
        console.log(err.message);
    }
}



module.exports = {
    adminHome,
    loadCreateUser,
    createUser,
    loadEditUser,
    deleteUser,
    editUser
}