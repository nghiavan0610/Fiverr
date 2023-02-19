const express = require('express');
const router = express.Router();
const listsController = require('../app/controllers/ListsController');
const { requireAuth } = require('../middlewares/AuthMiddleware');

router.get('/', requireAuth, listsController.getAllAccountLists);
router.get('/:list_id', requireAuth, listsController.getListById);
router.post('/create-list', requireAuth, listsController.createList);
router.put('/:list_id', requireAuth, listsController.editList);
router.delete('/:list_id', requireAuth, listsController.deleteList);

module.exports = router;
