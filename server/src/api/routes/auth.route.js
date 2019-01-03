const express = require("express");
const controller = require("../controllers/authController");
const oAuthLogin = require("../middlewares/auth").oAuth;

const router = express.Router();

router.route("/register").post(controller.register);

router.route("/login").post(controller.login);

router.route("/forgotPassword").post(controller.forgotPassword);

router.route("/google").post(oAuthLogin("google"), controller.oAuth);

router.route("/facebook").post(oAuthLogin("facebook"), controller.oAuth);

module.exports = router;
