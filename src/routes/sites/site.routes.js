const express = require('express');
const checkAuth = require('../middlewares/checkAuth.middleware');
const siteControllers = require('./site.controllers');
const router = express.Router();
const Url = require('../../constants/Url');

router.get('/', checkAuth, siteControllers.getSites);
router.get('/sitesPerRegion', checkAuth, siteControllers.getSitesGroupedByRegion);
router.get('/:siteId', checkAuth, siteControllers.getSiteDetail);


module.exports = router;