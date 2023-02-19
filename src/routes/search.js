const express = require('express');
const router = express.Router();
const searchController = require('../app/controllers//SearchController');
const { requireAuth } = require('../middlewares/AuthMiddleware');

router.get('/gigs', requireAuth, searchController.searchGigs);
router.get('/users', requireAuth, searchController.searchUsers);

module.exports = router;
