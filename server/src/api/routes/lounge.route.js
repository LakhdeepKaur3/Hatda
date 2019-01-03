const express = require('express')
const controller = require('../controllers/loungeController')
const { authorize} = require('../middlewares/auth');

const router = express.Router();

router.route("/").get(authorize(),controller.list);

router.route("/").post(authorize(),controller.create);

router.route("/:adminId").put(authorize(),controller.update);

router.route("/:adminId").delete(authorize(),controller.remove);

module.exports = router;