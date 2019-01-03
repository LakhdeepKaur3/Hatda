const mongoose = require("mongoose");

var loungeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    Adjectives: [
      {
        type: Array,
        ref: "Points"
      }
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true
  }
);

loungeSchema.method({
  transform() {
    const transformed = {};
    const fields = ["name", "members", "class"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});
module.exports = mongoose.model("Lounge", loungeSchema);
