var mongoose = require("mongoose");

var likeSchema = new mongoose.Schema({
  likeBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }, 
},
  {
    timestamps:true
  }
);

module.exports = mongoose.model("Like", likeSchema);
