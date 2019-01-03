const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const moment = require("moment-timezone");
const shortid = require("short-id");
const uuidv4 = require("uuid/v4");
const { jwtSecret, jwtExpirationInterval } = require("../../config/vars");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");

/**
 * User Roles
 */
const roles = ["user", "admin"];
const searchType =["user","post","feed","message"]
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    userName: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true,
      unique: true
    },
    nickName: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true,
      unique: true
    },
    realName: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      default: shortid.generate()
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      maxlength: 128
    },
    city: {
      type: String,
      maxlength: 128,
      default: "North America"
    },
    points:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'Point'
    },
    role: {
      type: String,
      enum: roles,
    },
    picture: {
        type: String,
        trim: true,
    },
    searchType:{
      type:String,
      enum:searchType
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    followers:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }],
    followings:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }],
    totalFollowers:{
      type:Number,
      default:0
    },
    totalFollowings:{
      type:Number,
      default:0
    },
    followDate: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = 10;

    var hash = bcrypt.hashSync(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ["email","userId","realName","nickName","city","class"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const playload = {
      exp: moment()
        .add(jwtExpirationInterval, "hour")
        .unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.encode(playload, jwtSecret);
  },
  passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

userSchema.statics = {
  async get(id){
    console.log(id);
    try{
      let user;

      if (mongoose.Types.ObjectId.isValid(id)){
        user =await this.findById(id).exec();
      }
      if(user){
        return user;
      }
      throw new APIError({
        message:'User does not exists',
        status:httpStatus.NOT_FOUND
      });
    }catch(error){
      throw(error)
    }
  },
  async findAndGenerateToken(options) {
    const { email, password } = options;
    if (!email)
      throw new APIError({
        message: "An email is required to generate a token"
      });
    const user = await this.findOne({
      email
    }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return {
          user,
          accessToken: user.token()
        };
      } else {
        err.message = "Incorrect email or password";
      }
      throw new APIError(err);
    }
  },
  
  list({ name, email, nickName, userName }) {
    const options = omitBy(
      {
        name,
        email,
        nickName,
        userName,  
      },
      isNil
    );

    return this.find(options)
      .sort({
        createdAt: -1
      })
      .exec();
  },

  async oAuthLogin({ service, id, email, name }) {
    const user = await this.findOne({
      $or: [
        {
          [`services.${service}`]: id
        },
        {
          email
        }
      ]
    });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: {
        [service]: id
      },
      email,
      password,
      name
    });
  },

  async verifyEmail(userId) {
    if (!userId) {
      console.log("No token found for verification");
    }
    try {
      const user = await this.findOneAndUpdate(
        {
          userId
        },
        {
          emailVerified: true
        }
      ).exec();

      if (user) {
        return user;
      } else {
        console.log("User does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
