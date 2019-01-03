const express = require("express");
const controller = require("../controllers/eventController")
const { authorize} = require('../middlewares/auth');

const router = express.Router();

router.route("/").get(authorize(),controller.list);

router.route("/create").post(authorize(),controller.create);

router.route("/update/:eventId").put(authorize(),controller.update);

router.route("/remove/:eventId").delete(authorize(),controller.remove);

module.exports = router;