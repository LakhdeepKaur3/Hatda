const mongoose = require("mongoose");

var contactSchema = new mongoose.Schema(
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
    name: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true,
      unique: true
    },
    message: {
      type: String,
      maxlength: 128,
      required: true
    },
    mobile: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
/**
 * @typedef Contact
 */
module.exports = mongoose.model("Contact", contactSchema);
