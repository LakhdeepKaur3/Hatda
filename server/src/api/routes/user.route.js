var express = require("express");
const controller = require("../controllers/userController");
const { authorize} = require('../middlewares/auth');
const fileUploadConfig = require('../../config/multer');

const router = express.Router();
/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId',controller.load);

router.route("/").get(authorize(),controller.list);

router.route('/profile').get(authorize(),controller.loggedIn);

router.route('/profileImageUpload').put(authorize(),fileUploadConfig.single('profileImage'),controller.uploadFile);

router.route('/:userId').get(authorize(),controller.get);

router.route("/profile").get(authorize(),controller.loggedIn);

router.route("/forgotPassword").post(controller.forgetPassword).put(controller.resetPassword);

router.route("/updatePassword").put(controller.updatePassword);

router.route("/follow").put(controller.follow);

router.route("/unfollow").put(controller.unfollow);

router.route('/followers/:userId').get(controller.getFollowersByUserId);

router.route('/followings/:userId').get(controller.getFollowingsByUserId);

module.exports = router;
