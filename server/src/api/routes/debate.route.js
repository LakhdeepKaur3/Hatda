const express = require('express');
const controller = require('../controllers/debateController');
const { authorize} = require('../middlewares/auth');

const router= express.Router();

router.route('/').get(authorize(),controller.list);

router.route('/create').post(authorize(),controller.create);

router.route('/:debateId').post(authorize(),controller.update);

router.route('/:debateId').post(authorize(),controller.remove);

module.exports = router;