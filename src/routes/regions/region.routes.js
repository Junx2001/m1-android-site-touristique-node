const express = require('express');
const checkAuth = require('../middlewares/checkAuth.middleware');
const router = express.Router();
const regionControllers = require('./region.controllers');

// Route to get all regions
router.get('/', checkAuth, regionControllers.getAllRegions);

module.exports = router;
