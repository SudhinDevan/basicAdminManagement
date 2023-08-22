const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err.message);
    }
}


module.exports = {
    isLogin
}