const express = require("express");
const controller = require("../controllers/societyController");

const router = express.Router();

router.route('/lounge').get(controller.listLounges);

router.route('/events').get(controller.listEvents);

module.exports = router;