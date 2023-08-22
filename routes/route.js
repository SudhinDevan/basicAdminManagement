const express = require('express');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/admin');

const router = express.Router();

router.get('/', userController.loadHome);

router.get('/signup', userController.loadSignup);
router.post('/signup', userController.createUser);

router.get('/login', userController.loadLogin);
router.post('/login', userController.verifyLogin);

router.get('/logout', userController.userLogout);

router.get('/admin/home', adminAuth.isLogin, adminController.adminHome);
router.get('/admin/create', adminAuth.isLogin, adminController.loadCreateUser);
router.post('/admin/create', adminController.createUser);
router.get('/admin/edit-user', adminAuth.isLogin, adminController.loadEditUser);
router.post('/admin/edit-user', adminController.editUser);

router.get('/admin/delete-user', adminController.deleteUser);


module.exports = router;


