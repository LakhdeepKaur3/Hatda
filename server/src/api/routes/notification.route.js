const express = require('express');
const controller = require('../controllers/notificationController');
const {authorize} = require('../middlewares/auth.js');

const router = express.Router();

router.route('/create').post(authorize(),controller.create);

router.route('/:userId').get(authorize(),controller.listById);

router.route('/:notificationId').delete(authorize(),controller.remove);

router.route('/remove/:userId').delete(authorize(),controller.removeAll);

router.route('/update/:notificationId').put(authorize(),controller.update);

module.exports = router;