const express = require("express");
const controller = require("../controllers/messageController");
const { authorize} = require('../middlewares/auth');

const router = express.Router();

router.route("/").get(authorize(),controller.list);

router.route("/:userId").get(authorize(),controller.listById);

router.route("/:recipient").post(authorize(),controller.newMessage);

router.route('/:userId').delete(authorize(),controller.remove);

module.exports = router;