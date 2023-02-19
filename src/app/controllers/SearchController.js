const searchService = require('../services/SearchService');
const { response } = require('../../helpers/Response');

class SearchController {
    // [GET] /api/search/gigs
    async searchGigs(req, res, next) {
        try {
            const queryData = req.query;
            const gigs = await searchService.searchGigs(queryData);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/search/users
    async searchUsers(req, res, next) {
        try {
            const queryData = req.query;

            const users = await searchService.searchUsers(queryData);
            res.status(200).json(response(users));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SearchController();
