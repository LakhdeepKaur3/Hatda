const mongoose = require("mongoose");

var debateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    title: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    tags: {
      type: String,
      ref: "Tags"
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
      expires:{ type:Date}
  },
  {
    timestamps:true
  }
);

debateSchema.method({
  transform() {
    const transformed = {};
    const fields = ["title", "topic", "opponent"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});

module.exports = mongoose.model("Debate",debateSchema);
