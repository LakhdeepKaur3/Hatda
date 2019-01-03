const express = require("express");
const controller = require("../controllers/postController");
const { authorize} = require('../middlewares/auth');

const router = express.Router();

router.route("/").get(authorize(),controller.list);

router.route("/:userId").get(authorize(),controller.listById);

router.route("/create").post(authorize(),controller.create);

router.route("/:postId").put(authorize(),controller.update);

router.route('/:postId').delete(authorize(),controller.remove);

router.route('/like/:postId/:action').put(authorize(),controller.like);

// router.route('/dislike/:postId').put(controller.dislike);

module.exports = router;
