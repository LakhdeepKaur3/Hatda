const User = require("../models/user.model");
const { sendPasswordEmail } = require("./verification.controller");
const { frontEnd } = require("../../config/vars");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");

 /**
 * Load user and append to req.
 * @public
 */
exports.load = async(req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return error;
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user infos
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());


exports.list = async (req, res, next) => {
  try {
    let count;
    User.find({}, (err, result) => {
      if(result) {
        count = result.length;
      }
    })
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.send({count, transformedUsers});
  } catch (error) {
    next(error);
  }
};


exports.listById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    let users = await User.get(id);
    if (users) {
      const transformedUsers = users.transform();
      return res.send({ transformedUsers });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile image
 * @public
 */
exports.uploadFile = async (req,res,next) => {
  try{
    console.log("request here");
    console.log(req.user._id);
    const savedUser = await User.findByIdAndUpdate(req.user._id,{picture:req.file.filename});
    res.status(httpStatus.OK).send({imageUrl:req.file.filename});
  }catch(error){
    next(error);
  }
}

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let users = await User.findOne({ email: email });

    if(!users){
      res.send({message:"No such user exists"})
    }
    let resetPasswordToken = randomString(30);
    let user = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: resetPasswordToken,
        new: true
      }
    );
    console.log(user + "after update");
    // resetPasswordToken = frontEnd + resetPasswordToken;
    await sendPasswordEmail(resetPasswordToken, { to: user.email });
    res.json({ message: "Link to reset password has sent you on mail" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let resetPasswordExpires = Date.now() + 3600000;
    const { resetPasswordToken, password, confirmPassword } = req.body;
    let users = await User.findOne({ resetPasswordToken: resetPasswordToken });

    if (!users) {
      return res.send({ message: "Wrong Token" });
    }
    if (password != confirmPassword) {
      return res.send({
        message: "password and confirm password doesnot match"
      });
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { resetPasswordToken: resetPasswordToken },
      { password: hash }
    );

    if (user) {
      return res.send({ message: "password updated successfully" });
    } else {
      res.send({ message: "No user found with this email" });
    }
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    let user = await User.findOne({ email: req.body.email });

    if (!(await user.passwordMatches(oldPassword))) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "Incorrect password" });
    }
    if (password != confirmPassword) {
      return res.send({
        message: "password and confirm password doesnot match"
      });
    }
    const hash = await bcrypt.hash(password, 10);

    const users = await User.findOneAndUpdate({ email :user.email}, { password: hash });
    if (users) {
      return res
        .status(httpStatus.OK)
        .send({ message: "password updated successfully" });
    } else {
      res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "No user found with this email" });
    }
  } catch (error) {
    next(error);
  }
};

exports.follow = async(req,res,next) => {
  try{
const { userId,followerId } = req.body;
let user = await User.findOne({ _id: userId });
if (!user) {
  return res.send({ message: "No such user exists" });
}
let follower = await User.findOne({ _id: followerId });
if (!follower) {
  return res.send({ message: "No such user exists" });
}
let followed=false;
user.followers.forEach(element =>{
  if(element==followerId){
    followed=true
  }
})
if(followed){
  return res.status(httpStatus.FORBIDDEN).send({message:'User already followed',totalFollowers:user.totalFollowers}); 
}else{
  let userFollowers = await User.findByIdAndUpdate({ _id: userId },{ $inc: { totalFollowers: 1 } },{ new: true } );
  let followers = await User.findByIdAndUpdate({ _id: userId },{ $addToSet: { followers: followerId } });
  let userFollowing = await User.findByIdAndUpdate({ _id: followerId },{ $inc: { totalFollowings: 1 } },{ new: true } );
  let followings =await User.findByIdAndUpdate({_id:followerId},{$addToSet:{followings:userId}});
  res.status(httpStatus.CREATED).send({ message: "Successfully Followed",totalFollowers:followers.totalFollowers});
}
  }catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.unfollow = async(req,res,next) =>{
  try{
  const { userId,followerId } = req.body;
  let user = await User.findOne({ _id: userId });
  if (!user) {
    return res.send({ message: "No such user exists" });
  }
  let follower = await User.findOne({ _id: followerId });
  if (!follower) {
    return res.send({ message: "No such user exists" });
  }
  let followed=false;
  user.followers.forEach(element =>{
  if(element==followerId){
    followed=true
  }
})
if(followed){
  if(follower.totalFollowers>0 || follower.totalFollowers==0) {
  let user =await User.findByIdAndUpdate({_id:userId},{$inc:{totalFollowers:-1}});
  let updatedUser =await User.findByIdAndUpdate({_id:userId},{$pull:{followers:followerId}});
  let userFollowing =await User.findByIdAndUpdate({_id:followerId},{$inc:{totalFollowings:-1}});
  let following =await User.findByIdAndUpdate({_id:followerId},{$pull:{followings:userId}});
  res.status(httpStatus.OK).send({message:'Successfully unfollowed',totalFollowers:updatedUser.totalFollowers})
  }
}else{
  res.status(httpStatus.OK).send({message:'Already unfollowed'})
}
}catch(error){
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
}
};

exports.getFollowersByUserId = async (req, res, next) => {
  try {
    console.log('I am here');
    const user = await User.find({_id: req.params.userId}).populate({ path: "followers", select: "nickName" });
    res.status(httpStatus.OK).send({ user,totalFollowers:user.totalFollowers});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.getFollowingsByUserId = async (req, res, next) => {
  try {
    console.log('I am here');
    const user = await User.find({_id: req.params.userId}).populate({ path: "followings", select: "nickName" });
    res.status(httpStatus.OK).send({ user,totalFollowings:user.totalFollowings});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

exports.test = async(req,res,next) => {
  try{
    console.log('here in there')
    res.send({message:'working'})
  }catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};



function randomString(length = 6) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
