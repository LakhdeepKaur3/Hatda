const express = require("express");
const controller = require("../controllers/aboutController");

const router = express.Router();

router.route('/').post(controller.create);

router.route('/:type').get(controller.list);

module.exports = router;