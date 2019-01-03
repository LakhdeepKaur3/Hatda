const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    type: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("About", aboutSchema);
