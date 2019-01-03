var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    body: {
      type: String,
      required: true
    }
});

module.exports = mongoose.model("Tag", tagSchema);