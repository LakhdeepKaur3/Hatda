var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
  {
    likeBy:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    comment:{
      type:String,
      maxlength:128
    },
    count: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Comment", commentSchema);
