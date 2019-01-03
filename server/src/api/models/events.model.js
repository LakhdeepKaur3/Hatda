var mongoose = require("mongoose");


var eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true
    },
    location: {
      type: String
    },
    participants: {
      type: Number
    },
    tags: {
      type: Array
    },
    description: {
      type: String
    },
    Interested: {
      type: Boolean,
      default: false
    },
    category: {
      type: String
    },
    date: {
      type: String,
      minlength: 6,
      required:true
    },
    shared: {
      type: Boolean,
      default: false
    },
    profile:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    createdBy:{
      type:String,
      required:true
    },
    expires:{ type:Date}
  },
  {
    timestamps: true
  }
);

eventSchema.method({
  transform() {
    console.log('Here in tranformed')
    const transformed = {};
    const fields = ["title", "location", "description"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
});

/**
 * @typedef Events
 */
module.exports = mongoose.model("Events", eventSchema);
