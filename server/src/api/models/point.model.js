var mongoose = require("mongoose");

var pointSchema = new mongoose.Schema(
  {
    brilliancePoints: {
      type: Number
    },
    reputationPoints: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Point", pointSchema);
