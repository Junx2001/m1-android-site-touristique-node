const express = require('express');
const checkAuth = require('../middlewares/checkAuth.middleware');
const notifControllers = require('./notification.controllers');
const router = express.Router();
const Url = require('../../constants/Url');

router.get('/', checkAuth, notifControllers.getAllMyNotifs);
router.get('/:notificationId', checkAuth, notifControllers.getNotifDetail);
router.post('/read/:notificationId', checkAuth, notifControllers.readNotif);


module.exports = router;