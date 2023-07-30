const express = require('express');
const serverControllers = require('./server.controllers');
const router = express.Router();

router.get('/health', serverControllers.getHealth);


module.exports = router;