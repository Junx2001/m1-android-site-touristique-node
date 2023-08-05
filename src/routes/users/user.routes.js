const express = require('express');
const checkAuth = require('../middlewares/checkAuth.middleware');
const userControllers = require('./user.controllers');
const router = express.Router();
const Url = require('../../constants/Url');

router.post(Url.USER_LOGIN_ROUTE, userControllers.userLogin);
router.post(Url.USER_SIGNUP_ROUTE, userControllers.userRegister);

router.get('/me', checkAuth, userControllers.getMe);
router.post('/updateProfile', checkAuth, userControllers.updateUserProfile);



module.exports = router;