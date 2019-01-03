const express = require("express");
const controller = require("../controllers/verification.controller");
const router = express.Router();

router.route("/email/:userId").get(controller.verifyUserEmail);

module.exports = router;
