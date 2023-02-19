const listsService = require('../services/ListsService');
const { response } = require('../../helpers/Response');

class ListsController {
    // [GET] /api/lists
    async getAllAccountLists(req, res, next) {
        try {
            const { id } = req.user;
            const lists = await listsService.getAllAccountLists(id);
            res.status(200).json(response(lists));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/lists/:list_id
    async getListById(req, res, next) {
        try {
            const { id } = req.user;
            const { list_id } = req.params;
            const list = await listsService.getListById(id, list_id);
            res.status(200).json(response(list));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/lists/create-list
    async createList(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const newList = await listsService.createList(id, formData);
            res.status(201).json(response(newList));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/lists/:list_id
    async editList(req, res, next) {
        try {
            const { id } = req.user;
            const { list_id } = req.params;
            const formData = req.body;
            const newList = await listsService.editList(id, list_id, formData);
            res.status(201).json(response(newList));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/lists/:list_id
    async deleteList(req, res, next) {
        try {
            const { id } = req.user;
            const { list_id } = req.params;
            await listsService.deleteList(id, list_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ListsController();
