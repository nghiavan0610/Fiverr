const express = require('express');
const router = express.Router();
const searchController = require('../app/controllers//SearchController');
const { requireAuth } = require('../middlewares/AuthMiddleware');

router.get('/gigs', searchController.searchGigs);
router.get('/users', searchController.searchUsers);

module.exports = router;
