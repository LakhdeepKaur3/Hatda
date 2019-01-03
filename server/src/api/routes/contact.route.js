const express = require('express');
const controller = require('../controllers/contactController');

const router = express.Router();

router.route('/').post(controller.contact);

module.exports = router;