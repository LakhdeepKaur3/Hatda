const mongoose = require("mongoose");
const httpStatus = require("http-status")
const APIError = require("../utils/APIError");

const MessageSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type:String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.method({
  transform() {
    const transformed = {};
    const fields = ["message","to", "from"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});
MessageSchema.statics = {
  async get(id){
    console.log(id);
    try{
      let message;

      if (mongoose.Types.ObjectId.isValid(id)){
        message =await this.findById(id).exec();
      }
      if(message){
        return message;
      }
      throw new APIError({
        message:'Message does not exists',
        status:httpStatus.NOT_FOUND
      });
    }catch(error){
      throw(error)
    }
  }
}

module.exports = mongoose.model("message", MessageSchema);
