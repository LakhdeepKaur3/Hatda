const User = require("../models/user.model");
const moment = require('moment-timezone');
const bcrypt =require('bcryptjs')
const { jwtExpirationInterval} = require('../../config/vars');
const { sendVerificationEmail } = require('./verification.controller');
const { sendVerificationMail } = require('../../config/vars');

function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    expiresIn,
  };
}

exports.register = async (req, res,next)=> {
  try{
 let body = req.body;
  const user=await (new User(body)).save();
  const userTransformed = user.transform();
  if (sendVerificationMail) {
    sendVerificationEmail(user.userId, { to: userTransformed.email });
  }
  return res.json({ code: "200", message: "successful registration" });
  } catch (error) {
  return next(error);
  }
};

exports.login = async(req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
exports.forgotPassword =async (req,res,next)=>{
  try{
    const {email, password,confirmPassword } =req.body;
    let user =await User.findOne({email:req.body.email});

    if(!user){
      res.send({message:"No such user exists"})
    }
    if(password !=confirmPassword){
      return res.send({message:"password and confirm password doesnot match"})
    }
    const hash = await bcrypt.hash(password,10);

    const users = await User.findOneAndUpdate({email},{password:hash});
    
    if(users){
      res.send({message:"password updated successfully"})
    }else{
      res.send({message:"No updates"})
    }
  }catch(error){
    next(error);
  }
}
exports.oAuth = async(req,res,next) => {
  try{
    const {user} =req;
    const accessToken =user.token();
    const token =generateTokenResponse(user,accessToken);
    const userTransformed =user.transform();
    return res.json({token,user:userTransformed});
  }catch(error){
    return next(error);
  }
};


