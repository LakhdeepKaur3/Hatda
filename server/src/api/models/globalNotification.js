var mongoose = require("mongoose");

var globalNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId.to,
    ref: "User"
  },
},
{
  timestamps:true
}
);

module.exports = mongoose.model("GlobalNotification", globalNotificationSchema);
