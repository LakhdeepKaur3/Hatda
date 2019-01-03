var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  dateAdded: {
    type: Date,
    default: Date.now()
  },
  seen: {
    type: Boolean,
    default: false
  }
},
{
  timestamps:true
});

notificationSchema.method({
  transform() {
    const transformed = {};
    const fields = ["type","title","to", "from","seen"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
