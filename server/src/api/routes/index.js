var express = require("express");
const authRoutes = require("./auth.route");
const verifyRoutes = require("./verify.route");
const userRoutes = require("./user.route");
const chatRoutes =require("./chat.route");
const postRoutes = require("./post.route");
const eventRoutes = require("./event.route");
const loungeRoutes = require("./lounge.route");
const debateRoutes = require("./debate.route");
const notificationRoutes = require('./notification.route');
const contactRoutes = require('./contact.route');
const aboutRoutes = require("./about.route");
const societyRoutes = require('./society.route');

var router = express.Router();
router.use("/auth", authRoutes);
router.use("/verify", verifyRoutes);
router.use("/user", userRoutes);
router.use("/chat",chatRoutes);
router.use("/post",postRoutes);
router.use("/event",eventRoutes);
router.use("/lounge",loungeRoutes);
router.use("/debate",debateRoutes);
router.use("/notification",notificationRoutes);
router.use("/contact",contactRoutes);
router.use("/about",aboutRoutes);
router.use("/society",societyRoutes);

module.exports = router;
